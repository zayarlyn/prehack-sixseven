import prisma from '../../common/lib/prisma';
import { notFound, badRequest } from '../../common/utils/errors';
import { CreateItemPayload, UpdateItemPayload } from './items.dto';

export async function createItem(sellerId: string, data: CreateItemPayload) {
  return prisma.item.create({
    data: {
      sellerId,
      title: data.title,
      description: data.description,
      price: data.price,
      category: data.category,
      condition: data.condition,
      pickupLocation: data.pickupLocation,
      openToOffers: data.openToOffers ?? false,
      status: 'active',
    },
    include: { itemImages: true },
  });
}

export async function getItem(itemId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { itemImages: true, seller: true },
  });

  if (!item) throw notFound('Item');

  await prisma.item.update({
    where: { id: itemId },
    data: { viewCount: { increment: 1 } },
  });

  const sellerSoldCount = await prisma.item.count({
    where: { sellerId: item.sellerId, status: 'sold' },
  });

  return { ...item, sellerSoldCount };
}

export interface ListItemsParams {
  limit?: number;
  page?: number;
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'newest' | 'low' | 'high';
  sellerId?: string;
}

export async function listItems(params: ListItemsParams = {}) {
  const { limit = 20, page = 1, q, category, minPrice, maxPrice, sort = 'newest', sellerId } = params;
  const skip = (page - 1) * limit;

  const where = {
    status: 'active' as const,
    ...(category && { category }),
    ...(sellerId && { sellerId }),
    ...(q && { title: { contains: q } }),
    ...((minPrice != null || maxPrice != null) && {
      price: {
        ...(minPrice != null && { gte: minPrice }),
        ...(maxPrice != null && { lte: maxPrice }),
      },
    }),
  };

  const orderBy =
    sort === 'low'
      ? { price: 'asc' as const }
      : sort === 'high'
        ? { price: 'desc' as const }
        : { createdAt: 'desc' as const };

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where,
      include: { itemImages: true, seller: true },
      skip,
      take: limit,
      orderBy,
    }),
    prisma.item.count({ where }),
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

export async function updateItem(itemId: string, sellerId: string, data: UpdateItemPayload) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) throw notFound('Item');
  if (item.sellerId !== sellerId) throw badRequest('Not authorized to update this item');

  return prisma.item.update({
    where: { id: itemId },
    data,
    include: { itemImages: true },
  });
}

export async function deleteItem(itemId: string, sellerId: string) {
  const item = await prisma.item.findUnique({ where: { id: itemId } });

  if (!item) throw notFound('Item');
  if (item.sellerId !== sellerId) throw badRequest('Not authorized to delete this item');

  return prisma.item.update({
    where: { id: itemId },
    data: { status: 'deleted', deletedAt: new Date() },
  });
}

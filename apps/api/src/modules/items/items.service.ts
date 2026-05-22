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

  return item;
}

export async function listItems(limit: number = 20, page: number = 1) {
  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    prisma.item.findMany({
      where: { status: 'active' },
      include: { itemImages: true, seller: true },
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.item.count({ where: { status: 'active' } }),
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

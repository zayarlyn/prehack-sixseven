import prisma from '../../common/lib/prisma';
import { notFound, badRequest } from '../../common/utils/errors';
import { CreateItemPayload, UpdateItemPayload } from './items.dto';

const itemImagesInclude = {
  itemImages: {
    include: { s3Object: true },
  },
} as const;

function mapItemImages<T extends { itemImages: { id: string; s3Object: { publicUrl: string } }[] }>(
  item: T,
): Omit<T, 'itemImages'> & { itemImages: { id: string; url: string }[] } {
  return {
    ...item,
    itemImages: item.itemImages.map((img) => ({ id: img.id, url: img.s3Object.publicUrl })),
  };
}

export async function createItem(sellerId: string, data: CreateItemPayload) {
  const item = await prisma.$transaction(async (tx) => {
    const created = await tx.item.create({
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
    });

    if (data.itemImageIds && data.itemImageIds.length > 0) {
      await tx.itemImage.updateMany({
        where: { id: { in: data.itemImageIds } },
        data: { itemId: created.id },
      });
    }

    return tx.item.findUniqueOrThrow({
      where: { id: created.id },
      include: itemImagesInclude,
    });
  });

  return mapItemImages(item);
}

export async function getItem(itemId: string) {
  const item = await prisma.item.findUnique({
    where: { id: itemId },
    include: { ...itemImagesInclude, seller: true },
  });

  if (!item) throw notFound('Item');

  await prisma.item.update({
    where: { id: itemId },
    data: { viewCount: { increment: 1 } },
  });

  const sellerSoldCount = await prisma.item.count({
    where: { sellerId: item.sellerId, status: 'sold' },
  });

  return { ...mapItemImages(item), sellerSoldCount };
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
      include: { ...itemImagesInclude, seller: true },
      skip,
      take: limit,
      orderBy,
    }),
    prisma.item.count({ where }),
  ]);

  return {
    items: items.map(mapItemImages),
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

  const updated = await prisma.item.update({
    where: { id: itemId },
    data,
    include: itemImagesInclude,
  });
  return mapItemImages(updated);
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

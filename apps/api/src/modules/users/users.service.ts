import prisma from '../../common/lib/prisma';
import { notFound } from '../../common/utils/errors';
import { UpdateProfilePayload } from './users.dto';

export async function getPublicProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      avatarUrl: true,
      faculty: true,
      major: true,
      year: true,
      programLevel: true,
      bio: true,
      createdAt: true,
    },
  });

  if (!user) throw notFound('User');

  const [soldCount, purchasedCount] = await Promise.all([
    prisma.item.count({ where: { sellerId: userId, status: 'sold' } }),
    prisma.transaction.count({ where: { buyerId: userId } }),
  ]);

  return {
    ...user,
    memberSince: user.createdAt,
    soldCount,
    purchasedCount,
    rating: null,
    reviews: null,
  };
}

export async function getMyProfile(userId: string) {
  return getPublicProfile(userId);
}

export async function updateProfile(userId: string, data: UpdateProfilePayload) {
  const { displayName, ...rest } = data;
  return prisma.user.update({
    where: { id: userId },
    data: { ...rest, ...(displayName !== undefined ? { fullName: displayName } : {}) },
  });
}

export async function getUserListings(userId: string) {
  return prisma.item.findMany({
    where: { sellerId: userId, status: 'active' },
    include: { itemImages: true },
  });
}

export async function getUserSold(userId: string) {
  return prisma.item.findMany({
    where: { sellerId: userId, status: 'sold' },
    include: { itemImages: true },
  });
}

export async function getUserPurchases(userId: string) {
  return prisma.transaction.findMany({
    where: { buyerId: userId },
    include: { item: { include: { itemImages: true } } },
  });
}

export async function getUserListingsPublic(userId: string) {
  return prisma.item.findMany({
    where: { sellerId: userId, status: 'active' },
    include: { itemImages: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getUserSoldPublic(userId: string) {
  return prisma.item.findMany({
    where: { sellerId: userId, status: 'sold' },
    include: { itemImages: true },
    orderBy: { createdAt: 'desc' },
  });
}

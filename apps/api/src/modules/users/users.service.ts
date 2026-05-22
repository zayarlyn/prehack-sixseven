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
      createdAt: true,
    },
  });

  if (!user) throw notFound('User');
  return user;
}

export async function updateProfile(userId: string, data: UpdateProfilePayload) {
  return prisma.user.update({
    where: { id: userId },
    data,
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

import prisma from '../../common/lib/prisma';
import { getDatabase } from '../../common/lib/firebase';
import { notFound, forbidden } from '../../common/utils/errors';
import { CreateConversationPayload } from './conversations.dto';
import crypto from 'crypto';

export async function createOrFetchConversation(buyerId: string, data: CreateConversationPayload) {
  const existing = await prisma.conversation.findFirst({
    where: {
      itemId: data.itemId,
      buyerId,
      sellerId: data.sellerId,
    },
  });

  if (existing) return existing;

  const firebaseId = crypto.randomUUID();
  const db = getDatabase();

  const conversation = await prisma.conversation.create({
    data: {
      firebaseId,
      itemId: data.itemId,
      buyerId,
      sellerId: data.sellerId,
    },
  });

  await db.ref(`conversations/${firebaseId}`).set({
    itemId: data.itemId,
    buyerId,
    sellerId: data.sellerId,
    createdAt: new Date().toISOString(),
  });

  return conversation;
}

export async function getConversations(userId: string) {
  return prisma.conversation.findMany({
    where: {
      OR: [{ buyerId: userId }, { sellerId: userId }],
    },
    include: {
      item: {
        include: {
          itemImages: {
            include: { s3Object: { select: { publicUrl: true } } },
          },
        },
      },
      buyer: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          createdAt: true,
          faculty: true,
          major: true,
          year: true,
          programLevel: true,
        },
      },
      seller: {
        select: {
          id: true,
          fullName: true,
          avatarUrl: true,
          createdAt: true,
          faculty: true,
          major: true,
          year: true,
          programLevel: true,
        },
      },
    },
    orderBy: { lastMessageAt: 'desc' },
  });
}

export async function updateLastMessage(conversationId: string, userId: string): Promise<void> {
  const conversation = await prisma.conversation.findUnique({ where: { id: conversationId } });
  if (!conversation) throw notFound('Conversation');
  const isParticipant = conversation.buyerId === userId || conversation.sellerId === userId;
  if (!isParticipant) throw forbidden();
  await prisma.conversation.update({
    where: { id: conversationId },
    data: { lastMessageAt: new Date() },
  });
}

export async function getConversationById(conversationId: string, userId: string) {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      item: true,
      buyer: true,
      seller: true,
    },
  });

  if (!conversation) throw notFound('Conversation');

  const isParticipant = conversation.buyerId === userId || conversation.sellerId === userId;
  if (!isParticipant) throw forbidden();

  return conversation;
}

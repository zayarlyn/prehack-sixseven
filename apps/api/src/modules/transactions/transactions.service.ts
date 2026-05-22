import prisma from '../../common/lib/prisma';
import { getDatabase } from '../../common/lib/firebase';
import { notFound, badRequest } from '../../common/utils/errors';
import { CreateTransactionPayload } from './transactions.dto';

export async function createTransaction(sellerId: string, data: CreateTransactionPayload) {
  return prisma.$transaction(async (tx) => {
    const item = await tx.item.findUnique({ where: { id: data.itemId } });
    if (!item) throw notFound('Item');
    if (item.sellerId !== sellerId) throw badRequest('Not authorized to close this item');

    const transaction = await tx.transaction.create({
      data: {
        itemId: data.itemId,
        sellerId,
        buyerId: data.buyerId,
        finalPrice: data.finalPrice,
        note: data.note,
        conversationId: data.conversationId,
      },
    });

    await tx.item.update({
      where: { id: data.itemId },
      data: {
        status: 'sold',
        soldAt: new Date(),
      },
    });

    if (data.conversationId) {
      const db = getDatabase();
      const conversation = await tx.conversation.findUnique({
        where: { id: data.conversationId },
      });

      if (conversation) {
        await db.ref(`conversations/${conversation.firebaseId}/messages`).push({
          senderId: null,
          type: 'system',
          content: 'Item sold',
          createdAt: Date.now(),
        });
      }
    }

    return transaction;
  });
}

export async function getTransaction(transactionId: string, userId: string) {
  const transaction = await prisma.transaction.findUnique({
    where: { id: transactionId },
    include: { item: true },
  });

  if (!transaction) throw notFound('Transaction');

  const isParty = transaction.buyerId === userId || transaction.sellerId === userId;
  if (!isParty) throw badRequest('Not authorized to view this transaction');

  return transaction;
}

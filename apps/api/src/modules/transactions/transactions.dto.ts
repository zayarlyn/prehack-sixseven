import { z } from 'zod';

export const CreateTransactionDto = z.object({
  itemId: z.string().cuid(),
  buyerId: z.string().cuid(),
  finalPrice: z.number().positive(),
  note: z.string().optional(),
  conversationId: z.string().cuid().optional(),
});

export type CreateTransactionPayload = z.infer<typeof CreateTransactionDto>;

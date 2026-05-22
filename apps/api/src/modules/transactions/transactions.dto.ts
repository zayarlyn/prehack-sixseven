import { z } from 'zod';

export const CreateTransactionDto = z.object({
  itemId: z.string().uuid(),
  buyerId: z.string().uuid(),
  finalPrice: z.number().positive(),
  note: z.string().optional(),
  conversationId: z.string().uuid().optional(),
});

export type CreateTransactionPayload = z.infer<typeof CreateTransactionDto>;

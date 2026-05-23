import { z } from 'zod';

export const CreateConversationDto = z.object({
  itemId: z.string().cuid(),
  sellerId: z.string().cuid(),
});

export type CreateConversationPayload = z.infer<typeof CreateConversationDto>;

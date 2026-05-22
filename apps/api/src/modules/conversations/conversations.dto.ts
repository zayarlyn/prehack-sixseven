import { z } from 'zod';

export const CreateConversationDto = z.object({
  itemId: z.string().uuid(),
  sellerId: z.string().uuid(),
});

export type CreateConversationPayload = z.infer<typeof CreateConversationDto>;

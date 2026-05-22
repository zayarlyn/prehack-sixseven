import { z } from 'zod';

export const CreateItemDto = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  category: z.enum(['books', 'electronics', 'furniture', 'clothing', 'other']),
  condition: z.enum(['new', 'like_new', 'good', 'fair']),
  pickupLocation: z.string().optional(),
  openToOffers: z.boolean().optional(),
  itemImageIds: z.array(z.string()).optional(),
});

export const UpdateItemDto = CreateItemDto.partial();

export type CreateItemPayload = z.infer<typeof CreateItemDto>;
export type UpdateItemPayload = z.infer<typeof UpdateItemDto>;

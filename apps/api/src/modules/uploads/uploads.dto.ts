import { z } from 'zod';

export const PresignDto = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  context: z.enum(['item_image', 'avatar']),
});

export const ConfirmUploadDto = z.object({
  objectKey: z.string().min(1),
  publicUrl: z.string().min(1),
  contentType: z.string().min(1),
  sizeBytes: z.number().optional(),
  context: z.enum(['item_image', 'avatar']),
});

export type PresignPayload = z.infer<typeof PresignDto>;
export type ConfirmUploadPayload = z.infer<typeof ConfirmUploadDto>;

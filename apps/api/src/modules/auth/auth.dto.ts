import { z } from 'zod';

export const CompleteProfileDto = z.object({
  year: z.number().min(1).max(10),
  programLevel: z.enum(['undergraduate', 'masters', 'phd']),
  faculty: z.string().min(1),
  major: z.string().min(1),
  bio: z.string().max(200).optional(),
});

export type CompleteProfilePayload = z.infer<typeof CompleteProfileDto>;

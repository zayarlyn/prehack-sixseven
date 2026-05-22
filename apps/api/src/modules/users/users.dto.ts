import { z } from 'zod';

export const UpdateProfileDto = z.object({
  year: z.number().optional(),
  programLevel: z.string().optional(),
  faculty: z.string().optional(),
  major: z.string().optional(),
  bio: z.string().optional(),
});

export type UpdateProfilePayload = z.infer<typeof UpdateProfileDto>;

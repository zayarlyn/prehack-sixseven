import { z } from 'zod';

export const UpdateProfileDto = z.object({
  displayName: z.string().optional(),
  year: z.number().optional(),
  programLevel: z.string().optional(),
  faculty: z.string().optional(),
  major: z.string().optional(),
  bio: z.string().max(200).optional(),
});

export type UpdateProfilePayload = z.infer<typeof UpdateProfileDto>;

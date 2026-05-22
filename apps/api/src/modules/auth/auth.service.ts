import prisma from '../../common/lib/prisma';
import { CompleteProfilePayload } from './auth.dto';

export async function completeProfile(userId: string, data: CompleteProfilePayload) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      year: data.year,
      programLevel: data.programLevel,
      faculty: data.faculty,
      major: data.major,
      bio: data.bio,
      onboarded: true,
    },
  });
}

export async function getOrCreateUser(microsoftId: string, email: string, fullName: string) {
  // TODO: Implement Microsoft auth flow
  return prisma.user.upsert({
    where: { microsoftId },
    update: {},
    create: {
      microsoftId,
      email,
      fullName,
    },
  });
}

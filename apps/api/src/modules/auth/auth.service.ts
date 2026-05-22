import jwt from 'jsonwebtoken';
import prisma from '../../common/lib/prisma';
import { msalClient, REDIRECT_URI } from '../../common/lib/msal';
import { CompleteProfilePayload } from './auth.dto';

export async function getMicrosoftAuthUrl(): Promise<string> {
  return msalClient.getAuthCodeUrl({
    scopes: ['openid', 'profile', 'email'],
    redirectUri: REDIRECT_URI,
  });
}

export async function handleMicrosoftCallback(code: string) {
  const tokenResponse = await msalClient.acquireTokenByCode({
    code,
    scopes: ['openid', 'profile', 'email'],
    redirectUri: REDIRECT_URI,
  });

  const claims = tokenResponse.idTokenClaims as {
    oid?: string;
    sub?: string;
    email?: string;
    preferred_username?: string;
    name?: string;
    tid?: string;
  };

  const tenantId = claims.tid;
  if (tenantId !== process.env.MICROSOFT_TENANT_ID) {
    const email = claims.email ?? claims.preferred_username ?? '';
    throw { code: 'INVALID_TENANT', email };
  }

  const microsoftId = claims.oid ?? claims.sub!;
  const email = claims.email ?? claims.preferred_username!;
  const fullName = claims.name ?? email;

  const user = await prisma.user.upsert({
    where: { microsoftId },
    update: {},
    create: { microsoftId, email, fullName },
  });

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '7d' });

  return { user, token };
}

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
  return prisma.user.upsert({
    where: { microsoftId },
    update: {},
    create: { microsoftId, email, fullName },
  });
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { unauthorized, forbidden } from '../../common/utils/errors';
import prisma from '../../common/lib/prisma';
import { SessionUser } from '@swap/types';

declare module 'express-serve-static-core' {
  interface Request {
    user?: SessionUser;
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    if (process.env.NODE_ENV !== 'production' && process.env.DEV_BYPASS_AUTH === 'true') {
      const bypassUserId = process.env.DEV_BYPASS_USER_ID;
      if (!bypassUserId) {
        throw new Error('DEV_BYPASS_AUTH is true but DEV_BYPASS_USER_ID is not set');
      }

      const user = await prisma.user.findUnique({
        where: { id: bypassUserId },
        select: { id: true, email: true, fullName: true, avatarUrl: true, onboarded: true },
      });

      if (!user) {
        throw new Error(`DEV_BYPASS_USER_ID "${bypassUserId}" not found in database. Run npm run db:seed first.`);
      }

      req.user = user;
      return next();
    }

    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) return next(unauthorized());

    const token = authHeader.split(' ')[1];

    let decoded: { id: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    } catch {
      return next(unauthorized('Invalid or expired token'));
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, fullName: true, avatarUrl: true, onboarded: true },
    });

    if (!user) return next(unauthorized('User not found'));

    req.user = user;
    return next();
  } catch (err) {
    return next(err);
  }
}

export function requireOwnership(getOwnerId: (req: Request) => string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.user?.id !== getOwnerId(req)) {
      return next(forbidden());
    }
    next();
  };
}

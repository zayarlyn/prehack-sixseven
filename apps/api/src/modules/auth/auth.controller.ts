import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import { success } from '../../common/utils/response';
import { unauthorized } from '../../common/utils/errors';
import { FRONTEND_URL } from '../../common/lib/msal';
import * as authService from './auth.service';

export const microsoftLogin = asyncHandler(async (_req: Request, res: Response) => {
  const url = await authService.getMicrosoftAuthUrl();
  res.redirect(url);
});

export const microsoftCallback = asyncHandler(async (req: Request, res: Response) => {
  const code = req.query.code as string | undefined;
  const error = req.query.error as string | undefined;

  if (error || !code) {
    return res.redirect(`${FRONTEND_URL}/auth/error?error=${encodeURIComponent(error ?? 'unknown')}`);
  }

  try {
    const { token, user } = await authService.handleMicrosoftCallback(code);
    const dest = user.onboarded ? '/' : '/auth/complete-profile';
    // Set httpOnly cookie and redirect without token in URL
    res.cookie('swap_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    return res.redirect(`${FRONTEND_URL}/auth/callback?next=${encodeURIComponent(dest)}`);
  } catch (err: any) {
    if (err?.code === 'INVALID_TENANT') {
      return res.redirect(`${FRONTEND_URL}/auth/error?error=invalid_tenant&email=${encodeURIComponent(err.email)}`);
    }
    throw err;
  }
});

export const logout = asyncHandler(async (_req: Request, res: Response) => {
  // Clear auth cookie
  res.clearCookie('swap_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  success(res, null, 200);
});

export const completeProfile = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw unauthorized();
  const user = await authService.completeProfile(req.user.id, req.body);
  success(res, user, 200);
});

export const getSession = asyncHandler(async (req: Request, res: Response) => {
  success(res, req.user);
});

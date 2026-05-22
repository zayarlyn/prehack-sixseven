import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import { success } from '../../common/utils/response';
import * as authService from './auth.service';

export const completeProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await authService.completeProfile(req.user!.id, req.body);
  success(res, user, 200);
});

export const microsoftCallback = asyncHandler(async (req: Request, res: Response) => {
  // TODO: Implement Microsoft OAuth callback
  res.json({ message: 'TODO: Microsoft callback' });
});

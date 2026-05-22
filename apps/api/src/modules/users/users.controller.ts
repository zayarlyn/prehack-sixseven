import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import * as usersService from './users.service';
import { success } from '../../common/utils/response';

export const getProfile = asyncHandler(async (req: Request, res: Response) => {
  const profile = await usersService.getPublicProfile(req.params.userId);
  success(res, profile);
});

export const updateProfile = asyncHandler(async (req: Request, res: Response) => {
  const user = await usersService.updateProfile(req.user!.id, req.body);
  success(res, user);
});

export const getListings = asyncHandler(async (req: Request, res: Response) => {
  const items = await usersService.getUserListings(req.user!.id);
  success(res, items);
});

export const getSold = asyncHandler(async (req: Request, res: Response) => {
  const items = await usersService.getUserSold(req.user!.id);
  success(res, items);
});

export const getPurchases = asyncHandler(async (req: Request, res: Response) => {
  const transactions = await usersService.getUserPurchases(req.user!.id);
  success(res, transactions);
});

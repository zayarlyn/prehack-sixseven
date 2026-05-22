import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import * as uploadsService from './uploads.service';
import { success } from '../../common/utils/response';

export const presign = asyncHandler(async (req: Request, res: Response) => {
  const result = await uploadsService.presign(req.user!.id, req.body);
  success(res, result);
});

export const confirmUpload = asyncHandler(async (req: Request, res: Response) => {
  const s3Object = await uploadsService.confirmUpload(req.user!.id, req.body);
  success(res, s3Object);
});

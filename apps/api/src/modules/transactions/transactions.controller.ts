import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import * as transactionsService from './transactions.service';
import { success } from '../../common/utils/response';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionsService.createTransaction(req.user!.id, req.body);
  success(res, transaction, 201);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const transaction = await transactionsService.getTransaction(req.params.transactionId, req.user!.id);
  success(res, transaction);
});

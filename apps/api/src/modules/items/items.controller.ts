import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import * as itemsService from './items.service';
import { success, paginated } from '../../common/utils/response';

export const create = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemsService.createItem(req.user!.id, req.body);
  success(res, item, 201);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemsService.getItem(req.params.itemId);
  success(res, item);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
  const page = Math.max(parseInt(req.query.page as string) || 1, 1);

  const result = await itemsService.listItems(limit, page);
  paginated(res, result.items, result.pagination);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemsService.updateItem(req.params.itemId, req.user!.id, req.body);
  success(res, item);
});

export const delete_ = asyncHandler(async (req: Request, res: Response) => {
  const item = await itemsService.deleteItem(req.params.itemId, req.user!.id);
  success(res, item);
});

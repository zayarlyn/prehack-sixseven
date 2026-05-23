import { Request, Response } from 'express';
import asyncHandler from '../../common/utils/asyncHandler';
import * as conversationsService from './conversations.service';
import { success } from '../../common/utils/response';
import { unauthorized } from '../../common/utils/errors';

export const createOrFetch = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await conversationsService.createOrFetchConversation(req.user!.id, req.body);
  success(res, conversation, 201);
});

export const getAll = asyncHandler(async (req: Request, res: Response) => {
  const conversations = await conversationsService.getConversations(req.user!.id);
  success(res, conversations);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  const conversation = await conversationsService.getConversationById(req.params.conversationId, req.user!.id);
  success(res, conversation);
});

export const updateLastMessage = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw unauthorized();
  await conversationsService.updateLastMessage(req.params.conversationId, req.user.id);
  success(res, null, 204);
});

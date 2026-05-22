import { Router } from 'express';
import * as conversationsController from './conversations.controller';
import { requireAuth } from '../auth/auth.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { CreateConversationDto } from './conversations.dto';

const router = Router();

router.post('/', requireAuth, validate(CreateConversationDto, 'body'), conversationsController.createOrFetch);
router.get('/', requireAuth, conversationsController.getAll);
router.get('/:conversationId', requireAuth, conversationsController.getById);
router.patch('/:conversationId/last-message', requireAuth, conversationsController.updateLastMessage);

export default router;

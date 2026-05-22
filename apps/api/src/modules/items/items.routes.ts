import { Router } from 'express';
import { validate } from '../../common/middleware/validate.middleware';
import { requireAuth } from '../auth/auth.middleware';
import * as itemsController from './items.controller';
import { CreateItemDto, UpdateItemDto } from './items.dto';

const router = Router();

router.post('/', requireAuth, validate(CreateItemDto, 'body'), itemsController.create);
router.get('/', itemsController.list);
router.get('/:itemId', itemsController.getById);
router.patch('/:itemId', requireAuth, validate(UpdateItemDto, 'body'), itemsController.update);
router.delete('/:itemId', requireAuth, itemsController.delete_);

export default router;

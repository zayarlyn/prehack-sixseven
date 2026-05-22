import { Router } from 'express';
import * as transactionsController from './transactions.controller';
import { requireAuth } from '../auth/auth.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { CreateTransactionDto } from './transactions.dto';

const router = Router();

router.post('/', requireAuth, validate(CreateTransactionDto, 'body'), transactionsController.create);
router.get('/:transactionId', requireAuth, transactionsController.getById);

export default router;

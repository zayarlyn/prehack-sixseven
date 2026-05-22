import { Router } from 'express';
import * as usersController from './users.controller';
import { requireAuth } from '../auth/auth.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { UpdateProfileDto } from './users.dto';

const router = Router();

router.get('/me/listings', requireAuth, usersController.getListings);
router.get('/me/sold', requireAuth, usersController.getSold);
router.get('/me/purchases', requireAuth, usersController.getPurchases);
router.patch('/me', requireAuth, validate(UpdateProfileDto, 'body'), usersController.updateProfile);
router.get('/:userId', usersController.getProfile);

export default router;

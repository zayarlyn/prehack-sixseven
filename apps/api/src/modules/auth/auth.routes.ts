import { Router } from 'express';
import * as authController from './auth.controller';
import { requireAuth } from './auth.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { CompleteProfileDto } from './auth.dto';
import { success } from '../../common/utils/response';

const router = Router();

router.get('/microsoft', authController.microsoftLogin);
router.get('/microsoft/callback', authController.microsoftCallback);

router.post('/complete-profile', requireAuth, validate(CompleteProfileDto, 'body'), authController.completeProfile);

router.get('/me', requireAuth, (req, res) => {
  success(res, req.user);
});

router.get('/session', requireAuth, authController.getSession);
router.post('/logout', requireAuth, authController.logout);

export default router;

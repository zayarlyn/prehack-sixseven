import { Router } from 'express';
import * as authController from './auth.controller';
import { requireAuth } from './auth.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { CompleteProfileDto } from './auth.dto';

const router = Router();

router.get('/microsoft', (req, res) => {
  res.json({ message: 'TODO: Microsoft login' });
});

router.get('/microsoft/callback', authController.microsoftCallback);

router.post('/complete-profile', requireAuth, validate(CompleteProfileDto, 'body'), authController.completeProfile);

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

router.get('/session', requireAuth, authController.getSession);

export default router;

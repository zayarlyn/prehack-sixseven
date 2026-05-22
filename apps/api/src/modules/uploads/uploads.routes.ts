import { Router } from 'express';
import * as uploadsController from './uploads.controller';
import { requireAuth } from '../auth/auth.middleware';
import { validate } from '../../common/middleware/validate.middleware';
import { PresignDto, ConfirmUploadDto } from './uploads.dto';

const router = Router();

router.post('/presign', requireAuth, validate(PresignDto, 'body'), uploadsController.presign);
router.post('/confirm', requireAuth, validate(ConfirmUploadDto, 'body'), uploadsController.confirmUpload);

export default router;

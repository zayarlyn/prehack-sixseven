import prisma from '../../common/lib/prisma';
import { generatePresignedUrl } from '../../common/lib/storage';
import { PresignPayload, ConfirmUploadPayload } from './uploads.dto';
import crypto from 'crypto';

export async function presign(userId: string, data: PresignPayload) {
  const objectKey = crypto.randomUUID();

  const { uploadUrl, publicUrl } = await generatePresignedUrl(objectKey, data.contentType);

  await prisma.s3Object.create({
    data: {
      key: objectKey,
      publicUrl,
      contentType: data.contentType,
      context: data.context,
    },
  });

  return {
    objectKey,
    uploadUrl,
  };
}

export async function confirmUpload(userId: string, data: ConfirmUploadPayload) {
  const s3Object = await prisma.s3Object.upsert({
    where: { key: data.objectKey },
    update: {
      publicUrl: data.publicUrl,
      sizeBytes: data.sizeBytes,
    },
    create: {
      key: data.objectKey,
      publicUrl: data.publicUrl,
      contentType: data.contentType,
      sizeBytes: data.sizeBytes,
      context: data.context,
    },
  });

  return s3Object;
}

export async function createItemImage(data: { s3ObjectId: string }) {
  return prisma.itemImage.create({
    data: {
      s3ObjectId: data.s3ObjectId,
      itemId: null,
    },
  });
}

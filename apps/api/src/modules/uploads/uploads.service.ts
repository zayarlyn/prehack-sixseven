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
    publicUrl,
  };
}

export async function confirmUpload(_userId: string, data: ConfirmUploadPayload) {
  return prisma.$transaction(async (tx) => {
    const s3Object = await tx.s3Object.upsert({
      where: { key: data.objectKey },
      update: { publicUrl: data.publicUrl, sizeBytes: data.sizeBytes },
      create: {
        key: data.objectKey,
        publicUrl: data.publicUrl,
        contentType: data.contentType,
        sizeBytes: data.sizeBytes,
        context: data.context,
      },
    });

    if (data.context === 'item_image') {
      const existing = await tx.itemImage.findFirst({ where: { s3ObjectId: s3Object.id } });
      if (existing) return existing;
      return tx.itemImage.create({ data: { s3ObjectId: s3Object.id, itemId: null } });
    }

    return s3Object;
  });
}

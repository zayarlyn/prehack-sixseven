export async function generatePresignedUrl(
  _objectKey: string,
  _contentType: string,
): Promise<{ uploadUrl: string; publicUrl: string }> {
  // TODO: Implement with actual storage provider (S3, Firebase Storage, etc.)
  return {
    uploadUrl: '',
    publicUrl: '',
  };
}

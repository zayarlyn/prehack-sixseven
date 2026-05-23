import { useMutation } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';

type PresignInput = { filename: string; contentType: string; context: 'item_image' | 'avatar' };
type PresignResult = { data: { objectKey: string; uploadUrl: string; publicUrl: string } };

type ConfirmInput = {
  objectKey: string;
  publicUrl: string;
  contentType: string;
  sizeBytes?: number;
  context: 'item_image' | 'avatar';
};
type ConfirmResult = { data: { id: string } };

export function usePresignUrl() {
  return useMutation({
    mutationFn: (data: PresignInput) => axios.post<PresignResult>('/uploads/presign', data).then((r) => r.data),
  });
}

export function useConfirmUpload() {
  return useMutation({
    mutationFn: (data: ConfirmInput) => axios.post<ConfirmResult>('/uploads/confirm', data).then((r) => r.data),
  });
}

import { useMutation } from '@tanstack/react-query';
import axios from '@swap-web/common/lib/axios';

export function usePresignUrl() {
  return useMutation({
    mutationFn: (data: any) => axios.post('/api/uploads/presign', data).then((r) => r.data),
  });
}

export function useConfirmUpload() {
  return useMutation({
    mutationFn: (data: any) => axios.post('/api/uploads/confirm', data).then((r) => r.data),
  });
}

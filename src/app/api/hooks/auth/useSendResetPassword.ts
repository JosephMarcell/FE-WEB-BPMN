import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface SendResetPasswordData {
  email: string;
}

interface SendResetPasswordResponse {
  message: string;
}

export const useSendResetPassword = () => {
  return useMutation<SendResetPasswordResponse, Error, SendResetPasswordData>({
    mutationKey: ['send-reset-password'],
    mutationFn: async (data: SendResetPasswordData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/forgot-password', // Pastikan endpoint sesuai dengan backend
        data,
      );
      return response.data;
    },
  });
};

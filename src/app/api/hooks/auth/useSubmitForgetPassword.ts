import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface SubmitForgetPasswordData {
  token: string;
  new_password: string;
  confirm_pwd: string;
}

interface SubmitForgetPasswordResponse {
  message: string;
}

export const useSubmitForgetPassword = () => {
  return useMutation<
    SubmitForgetPasswordResponse,
    Error,
    SubmitForgetPasswordData
  >({
    mutationKey: ['resetPassword'],
    mutationFn: async (data: SubmitForgetPasswordData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/reset-password', // Pastikan endpoint sesuai dengan backend
        data,
      );
      return response.data;
    },
  });
};

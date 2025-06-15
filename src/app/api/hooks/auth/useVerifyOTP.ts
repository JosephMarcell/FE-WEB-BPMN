import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

// Sesuaikan dengan kebutuhan backend
interface VerifyEmailData {
  email: string; // Email dibutuhkan
  otp: string; // OTP dibutuhkan
}

// Sesuaikan dengan response backend
interface VerifyEmailResponse {
  message: string;
  data: {
    email: string;
    is_verified: boolean;
  };
}

export const useVerifyOtp = () => {
  return useMutation<VerifyEmailResponse, Error, VerifyEmailData>({
    mutationKey: ['verify-email'],
    mutationFn: async (data: VerifyEmailData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/verify-email', // Pastikan path sesuai
        data,
      );
      return response.data;
    },
  });
};

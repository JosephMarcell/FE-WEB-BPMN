import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

// Sesuaikan interface dengan format yang diharapkan backend
interface LoginData {
  email: string; // Ubah dari email_or_username menjadi email
  password: string;
}

// Sesuaikan response interface dengan struktur response backend
interface LoginResponse {
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    role: string;
    is_verified: boolean;
    access_token: string;
  };
}

export const useLogIn = () => {
  return useMutation<LoginResponse, Error, LoginData>({
    mutationKey: ['login'],
    mutationFn: async (data: LoginData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/login', // Pastikan path sesuai
        data,
      );
      return response.data;
    },
  });
};

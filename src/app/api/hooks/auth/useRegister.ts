import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

// Interface yang sesuai dengan backend Go
interface RegisterData {
  user_name: string;
  email: string;
  password: string;
  full_name: string;
  alamat: string;
  latitude: number;
  longitude: number;
}

// Interface response sesuai dengan format backend
interface RegisterResponse {
  message: string;
  data: {
    id: string;
    username: string;
    email: string;
    role: string;
    IsVerified: boolean;
  };
}

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterData>({
    mutationKey: ['register'],
    mutationFn: async (data: RegisterData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/register', // Pastikan path sesuai
        data,
      );
      return response.data;
    },
  });
};

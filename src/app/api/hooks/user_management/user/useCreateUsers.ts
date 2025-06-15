import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UserCreateData {
  nik: string;
  username: string;
  email: string;
  password: string;
  confirm_pwd: string;
  first_name: string;
  last_name: string;
  gender: string;
  role?: number | null;
  office?: number | null;
}

export const useCreateUsers = () => {
  return useMutation({
    mutationKey: ['createUsers'],
    mutationFn: async (data: UserCreateData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/management/create-user',
        data,
      );
      return response.data;
    },
  });
};

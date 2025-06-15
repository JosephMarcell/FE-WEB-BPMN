import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UpdateUserPayload {
  id: string; // UUID string
  data: {
    userName: string;
    email: string;
    full_name: string;
    alamat: string;
    latitude: number;
    longitude: number;
  };
}

export const useUpdateUser = () => {
  return useMutation({
    mutationKey: ['updateUserById'],
    mutationFn: async ({ id, data }: UpdateUserPayload) => {
      const response = await AxiosService.AxiosServiceUserManagement.put(
        `/api/admin/users/${id}`,
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UpdateProfilePayload {
  username: string;
  full_Name: string;
  alamat: string;
  latitude: number;
  longitude: number;
}

export const useUpdateProfile = () => {
  return useMutation({
    mutationKey: ['updateProfile'],
    mutationFn: async (data: UpdateProfilePayload) => {
      const response = await AxiosService.AxiosServiceUserManagement.put(
        '/api/users/profile',
        data,
      );
      return response.data;
    },
  });
};

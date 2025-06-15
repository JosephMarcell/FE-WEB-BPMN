import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteUser = () => {
  return useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: async (userId: string) => {
      const response = await AxiosService.AxiosServiceUserManagement.delete(
        `/api/admin/users/${userId}`,
      );
      return response.data;
    },
  });
};

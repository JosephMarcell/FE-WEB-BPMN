import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSoftDeleteUser = () => {
  return useMutation({
    mutationKey: ['deleteUser'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceUserManagement.put(
        `/management/delete-user/${pkid}`,
      );
      return response.data;
    },
  });
};

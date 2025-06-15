import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeletePosition = () => {
  return useMutation({
    mutationKey: ['deletePosition'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `position/${pkid}`,
      );
      return response.data;
    },
  });
};

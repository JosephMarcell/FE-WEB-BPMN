import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteCharity = () => {
  return useMutation({
    mutationKey: ['deleteCharity'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `amal/${pkid}`,
      );
      return response.data;
    },
  });
};

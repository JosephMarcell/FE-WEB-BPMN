import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteOvertime = () => {
  return useMutation({
    mutationKey: ['deleteOvertime'],
    mutationFn: async (pkid: number) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.delete(
          `overtime/${pkid}/`,
        );
        return response.data;
      } catch (error) {
        throw new Error('Error deleting overtime: ' + error);
      }
    },
  });
};

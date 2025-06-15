import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteViolation = () => {
  return useMutation({
    mutationKey: ['deleteHardViolation  '],
    mutationFn: async (pkid: number) => {
      const url = `/violations/${pkid}`;
      const response = await AxiosService.AxiosServiceViolations.delete(url);
      return response.data;
    },
  });
};

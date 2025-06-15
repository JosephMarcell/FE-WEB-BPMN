import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSoftDeleteViolation = () => {
  return useMutation({
    mutationKey: ['deleteViolation  '],
    mutationFn: async (pkid: number) => {
      const url = `/violations/${pkid}/soft-delete`;
      const response = await AxiosService.AxiosServiceViolations.put(url);
      return response.data;
    },
  });
};

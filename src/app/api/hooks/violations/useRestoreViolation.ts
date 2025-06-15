import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useRestoreViolation = () => {
  return useMutation({
    mutationKey: ['restoreViolation  '],
    mutationFn: async (pkid: number) => {
      const url = `/violations/${pkid}/restore`;
      const response = await AxiosService.AxiosServiceViolations.put(url);
      return response.data;
    },
  });
};

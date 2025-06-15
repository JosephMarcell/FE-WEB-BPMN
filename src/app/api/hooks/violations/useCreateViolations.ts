import { useMutation } from '@tanstack/react-query';

import { createViolationProps } from '@/helpers/utils/violations/violation';
import AxiosService from '@/services/axiosService';

export const useCreateViolation = () => {
  return useMutation({
    mutationKey: ['createViolation'],
    mutationFn: async (data: createViolationProps) => {
      const url = '/violations';
      const response = await AxiosService.AxiosServiceViolations.post(
        url,
        data,
      );
      return response.data;
    },
  });
};

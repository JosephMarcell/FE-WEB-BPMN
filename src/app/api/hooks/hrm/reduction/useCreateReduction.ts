import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface Create {
  ss_id: number;
  reduction_name_id: number;
  amount: number;
}

export const useCreateReduction = () => {
  return useMutation({
    mutationKey: ['createReduction'],
    mutationFn: async (data: Create) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'reduction/',
        data,
      );
      return response.data;
    },
  });
};

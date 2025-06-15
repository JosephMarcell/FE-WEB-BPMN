import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface Create {
  ss_id: number;
  allowance_name_id: number;
  amount: number;
}

export const useCreateAllowance = () => {
  return useMutation({
    mutationKey: ['createAllowance'],
    mutationFn: async (data: Create) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'allowance/',
        data,
      );
      return response.data;
    },
  });
};

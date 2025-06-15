import { useMutation } from '@tanstack/react-query';

import { CashAccountProperty } from '@/helpers/utils/cash_bank/cash_account';
import AxiosService from '@/services/axiosService';

export const useCreateCashAccount = () => {
  return useMutation({
    mutationKey: ['createCashAccount'],
    mutationFn: async (data: CashAccountProperty) => {
      const response = await AxiosService.AxiosServiceCashBank.post(
        'cashAccount/',
        data,
      );
      return response.data;
    },
  });
};

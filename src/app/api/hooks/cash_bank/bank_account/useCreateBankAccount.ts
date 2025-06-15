import { useMutation } from '@tanstack/react-query';

import { BankAccountProperty } from '@/helpers/utils/cash_bank/bank_account';
import AxiosService from '@/services/axiosService';

export const useCreateBankAccount = () => {
  return useMutation({
    mutationKey: ['createBankAccount'],
    mutationFn: async (data: BankAccountProperty) => {
      const response = await AxiosService.AxiosServiceCashBank.post(
        'bankAccount/',
        data,
      );
      return response.data;
    },
  });
};

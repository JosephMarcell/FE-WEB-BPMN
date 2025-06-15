import { useMutation } from '@tanstack/react-query';

import { BankAccountProperty } from '@/helpers/utils/cash_bank/bank_account';
import AxiosService from '@/services/axiosService';

export const useUpdateBankAccount = () => {
  return useMutation({
    mutationKey: ['updateBankAccount'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<BankAccountProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceCashBank.put(
        `bankAccount/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

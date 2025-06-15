import { useMutation } from '@tanstack/react-query';

import { BankReceiptProperty } from '@/helpers/utils/cash_bank/bank_receipt';
import AxiosService from '@/services/axiosService';

export const useCreateBankReceipt = () => {
  return useMutation({
    mutationKey: ['createBankReceipt'],
    mutationFn: async (data: BankReceiptProperty) => {
      const response = await AxiosService.AxiosServiceCashBank.post(
        'bankReceipt/',
        data,
      );
      return response.data;
    },
  });
};

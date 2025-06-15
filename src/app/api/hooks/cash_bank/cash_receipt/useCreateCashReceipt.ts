import { useMutation } from '@tanstack/react-query';

import { CashReceiptProperty } from '@/helpers/utils/cash_bank/cash_receipt';
import AxiosService from '@/services/axiosService';

export const useCreateCashReceipt = () => {
  return useMutation({
    mutationKey: ['createCashReceipt'],
    mutationFn: async (data: CashReceiptProperty) => {
      const response = await AxiosService.AxiosServiceCashBank.post(
        'cashReceipt/',
        data,
      );
      return response.data;
    },
  });
};

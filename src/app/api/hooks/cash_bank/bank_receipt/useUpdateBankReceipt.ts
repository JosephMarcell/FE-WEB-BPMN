import { useMutation } from '@tanstack/react-query';

import { BankReceiptProperty } from '@/helpers/utils/cash_bank/bank_receipt';
import AxiosService from '@/services/axiosService';

export const useUpdateBankReceipt = () => {
  return useMutation({
    mutationKey: ['updateBankReceipt'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<BankReceiptProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceCashBank.put(
        `bankReceipt/columns/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

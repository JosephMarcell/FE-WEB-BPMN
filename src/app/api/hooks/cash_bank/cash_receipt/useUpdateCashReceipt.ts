import { useMutation } from '@tanstack/react-query';

import { CashReceiptProperty } from '@/helpers/utils/cash_bank/cash_receipt';
import AxiosService from '@/services/axiosService';

export const useUpdateCashReceipt = () => {
  return useMutation({
    mutationKey: ['updateCashReceipt'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<CashReceiptProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceCashBank.put(
        `cashReceipt/columns/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

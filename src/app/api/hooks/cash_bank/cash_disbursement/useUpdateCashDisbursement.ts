import { useMutation } from '@tanstack/react-query';

import { CashDisbursementProperty } from '@/helpers/utils/cash_bank/cash_disbursement';
import AxiosService from '@/services/axiosService';

export const useUpdateCashDisbursement = () => {
  return useMutation({
    mutationKey: ['updateCashDisbursement'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<CashDisbursementProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceCashBank.put(
        `cashDisbursement/columns/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

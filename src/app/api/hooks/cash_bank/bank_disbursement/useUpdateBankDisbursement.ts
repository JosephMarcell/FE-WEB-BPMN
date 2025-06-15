import { useMutation } from '@tanstack/react-query';

import { BankDisbursementProperty } from '@/helpers/utils/cash_bank/bank_disbursement';
import AxiosService from '@/services/axiosService';

export const useUpdateBankDisbursement = () => {
  return useMutation({
    mutationKey: ['updateBankDisbursement'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<BankDisbursementProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceCashBank.put(
        `bankDisbursement/columns/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

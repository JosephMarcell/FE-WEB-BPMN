import { useMutation } from '@tanstack/react-query';

import { CashDisbursementProperty } from '@/helpers/utils/cash_bank/cash_disbursement';
import AxiosService from '@/services/axiosService';

export const useCreateCashDisbursement = () => {
  return useMutation({
    mutationKey: ['createCashDisbursement'],
    mutationFn: async (data: CashDisbursementProperty) => {
      const response = await AxiosService.AxiosServiceCashBank.post(
        'cashDisbursement/',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { BankDisbursementProperty } from '@/helpers/utils/cash_bank/bank_disbursement';
import AxiosService from '@/services/axiosService';

export const useCreateBankDisbursement = () => {
  return useMutation({
    mutationKey: ['createBankDisbursement'],
    mutationFn: async (data: BankDisbursementProperty) => {
      const response = await AxiosService.AxiosServiceCashBank.post(
        'bankDisbursement/',
        data,
      );
      return response.data;
    },
  });
};

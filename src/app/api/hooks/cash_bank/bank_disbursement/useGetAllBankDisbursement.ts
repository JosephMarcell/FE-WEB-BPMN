import { useQuery } from '@tanstack/react-query';

import { BankDisbursement } from '@/helpers/utils/cash_bank/bank_disbursement';
import AxiosService from '@/services/axiosService';

export const useGetAllBankDisbursement = () => {
  return useQuery<BankDisbursement[]>({
    queryKey: ['listBankDisbursement'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'bankDisbursement/',
      );
      return data.data.map((item: { result: BankDisbursement }) => item.result);
    },
  });
};

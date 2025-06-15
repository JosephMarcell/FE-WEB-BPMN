import { useQuery } from '@tanstack/react-query';

import { BankReceipt } from '@/helpers/utils/cash_bank/bank_receipt';
import AxiosService from '@/services/axiosService';

export const useGetAllBankReceipt = () => {
  return useQuery<BankReceipt[]>({
    queryKey: ['listBankReceipt'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'bankReceipt/',
      );
      return data.data.map((item: { result: BankReceipt }) => item.result);
    },
  });
};

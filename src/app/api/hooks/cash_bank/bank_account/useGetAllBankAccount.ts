import { useQuery } from '@tanstack/react-query';

import { BankAccount } from '@/helpers/utils/cash_bank/bank_account';
import AxiosService from '@/services/axiosService';

export const useGetAllBankAccount = () => {
  return useQuery<BankAccount[]>({
    queryKey: ['listBankAccount'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'bankAccount/',
      );
      return data.data.map((item: { result: BankAccount }) => item.result); // Map to extract the `result` property
    },
  });
};

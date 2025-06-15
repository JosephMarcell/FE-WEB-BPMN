import { useQuery } from '@tanstack/react-query';

import { CashAccount } from '@/helpers/utils/cash_bank/cash_account';
import AxiosService from '@/services/axiosService';

export const useGetAllCashAccount = () => {
  return useQuery<CashAccount[]>({
    queryKey: ['listCashAccount'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'cashAccount/',
      );
      return data.data.map((item: { result: CashAccount }) => item.result); // Map to extract the `result` property
    },
  });
};

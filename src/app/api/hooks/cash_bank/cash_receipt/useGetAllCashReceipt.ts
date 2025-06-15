import { useQuery } from '@tanstack/react-query';

import { CashReceipt } from '@/helpers/utils/cash_bank/cash_receipt';
import AxiosService from '@/services/axiosService';

export const useGetAllCashReceipt = () => {
  return useQuery<CashReceipt[]>({
    queryKey: ['listCashReceipt'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'cashReceipt/',
      );
      return data.data.map((item: { result: CashReceipt }) => item.result);
    },
  });
};

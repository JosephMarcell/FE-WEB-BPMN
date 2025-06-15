import { useQuery } from '@tanstack/react-query';

import { CashDisbursement } from '@/helpers/utils/cash_bank/cash_disbursement';
import AxiosService from '@/services/axiosService';

export const useGetAllCashDisbursement = () => {
  return useQuery<CashDisbursement[]>({
    queryKey: ['listCashDisbursement'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get(
        'cashDisbursement/',
      );
      return data.data.map((item: { result: CashDisbursement }) => item.result);
    },
  });
};

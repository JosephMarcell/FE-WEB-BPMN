import { useQuery } from '@tanstack/react-query';

import { Bank } from '@/helpers/utils/cash_bank/bank';
import AxiosService from '@/services/axiosService';

export const useGetAllListBank = () => {
  return useQuery<Bank[]>({
    queryKey: ['listBank'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceCashBank.get('listBank/');
      return data.data.map((item: { result: Bank }) => item.result);
    },
  });
};

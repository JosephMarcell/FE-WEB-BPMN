import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllTransactionType = () => {
  return useQuery({
    queryKey: ['listTransactionType'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        'transactionType/',
      );
      return data.data;
    },
  });
};

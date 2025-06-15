import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllPurchaseRequest = () => {
  return useQuery({
    queryKey: ['listPurchaseRequest'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchaseRequest/',
      );
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllPurchaseOrder = () => {
  return useQuery({
    queryKey: ['listPurchaseOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchaseOrder/',
      );
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPurchaseRequestForDropwdown = () => {
  return useQuery({
    queryKey: ['listPurchaseRequestForDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchaseRequest/dropdown',
      );
      return data.data;
    },
  });
};

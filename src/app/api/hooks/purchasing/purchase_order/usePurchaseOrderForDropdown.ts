import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const usePurchaseOrderForDropdown = (enabled = true) => {
  return useQuery({
    queryKey: ['listPurchaseOrderForDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchaseOrder/dropdown',
      );
      return data.data;
    },
    enabled: enabled,
  });
};

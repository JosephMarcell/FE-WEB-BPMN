import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSalesOrderForDropdown = (enabled = true) => {
  return useQuery({
    queryKey: ['listPurchaseOrderForDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get(
        'salesOrder/dropdown',
      );
      return data.data;
    },
    enabled: enabled,
  });
};

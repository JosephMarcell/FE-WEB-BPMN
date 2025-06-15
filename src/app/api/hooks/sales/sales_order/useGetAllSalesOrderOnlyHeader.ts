import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllSalesOrderOnlyHeader = () => {
  return useQuery({
    queryKey: ['listSalesOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get(
        'salesOrder/headers',
      );

      return data.data;
    },
  });
};

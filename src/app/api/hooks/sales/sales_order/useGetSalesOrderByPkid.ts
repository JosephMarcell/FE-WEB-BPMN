import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSalesOrderByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid, 'salesOrderDetail'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceSales.get(
        `salesOrder/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

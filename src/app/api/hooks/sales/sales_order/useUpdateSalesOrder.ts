import { useMutation } from '@tanstack/react-query';

import { SalesOrderProperty } from '@/helpers/utils/sales/sales';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: SalesOrderProperty;
}
export const useUpdateSalesOrder = () => {
  return useMutation({
    mutationKey: ['useUpdateSalesOrder'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceSales.put(
        `salesOrder/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

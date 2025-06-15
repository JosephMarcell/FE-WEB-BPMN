import { useMutation } from '@tanstack/react-query';

import { CustomerProperty } from '@/helpers/utils/sales/customer';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: CustomerProperty;
}
export const useUpdateCustomer = () => {
  return useMutation({
    mutationKey: ['useUpdateCustomer'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceSales.put(
        `customer/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

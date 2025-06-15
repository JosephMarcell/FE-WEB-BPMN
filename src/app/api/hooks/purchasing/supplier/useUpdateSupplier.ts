import { useMutation } from '@tanstack/react-query';

import { SupplierProperty } from '@/helpers/utils/purchasing/supplier';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: SupplierProperty;
}
export const useUpdateSupplier = () => {
  return useMutation({
    mutationKey: ['useUpdateSupplierByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServicePurchasing.put(
        `supplier/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

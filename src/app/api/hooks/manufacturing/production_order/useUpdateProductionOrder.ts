import { useMutation } from '@tanstack/react-query';

import { ProductionOrderProperty } from '@/helpers/utils/manufacturing/production_order';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: ProductionOrderProperty;
}
export const useUpdateProductionOrder = () => {
  return useMutation({
    mutationKey: ['updateProductionOrderByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `production_order/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

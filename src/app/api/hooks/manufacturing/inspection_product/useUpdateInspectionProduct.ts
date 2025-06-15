import { useMutation } from '@tanstack/react-query';

import { InspectionProductProperty } from '@/helpers/utils/manufacturing/inspection_product';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: InspectionProductProperty;
}
export const useUpdateInspectionProduct = () => {
  return useMutation({
    mutationKey: ['updateInspectionProduct'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `inspection_product/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

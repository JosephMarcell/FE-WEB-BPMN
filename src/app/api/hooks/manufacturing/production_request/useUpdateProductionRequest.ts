import { useMutation } from '@tanstack/react-query';

import { ProductionRequestProperty } from '@/helpers/utils/manufacturing/production_request';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: ProductionRequestProperty;
}
export const useUpdateProductionRequest = () => {
  return useMutation({
    mutationKey: ['updateProductionRequestByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `production_request/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

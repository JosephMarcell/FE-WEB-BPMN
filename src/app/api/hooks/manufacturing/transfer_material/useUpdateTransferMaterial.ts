import { useMutation } from '@tanstack/react-query';

import { RequestManProperty } from '@/helpers/utils/manufacturing/request_man';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: RequestManProperty;
}
export const useUpdateTransferMaterial = () => {
  return useMutation({
    mutationKey: ['updateTransferMaterialByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `transfer_material/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

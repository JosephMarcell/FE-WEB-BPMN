import { useMutation } from '@tanstack/react-query';

import { IssueMaterialProperty } from '@/helpers/utils/manufacturing/issue_material';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: IssueMaterialProperty;
}
export const useUpdateIssueMaterial = () => {
  return useMutation({
    mutationKey: ['updateIssueMaterialByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `issue_material/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

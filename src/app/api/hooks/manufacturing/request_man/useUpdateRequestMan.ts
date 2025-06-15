import { useMutation } from '@tanstack/react-query';

import { RequestManProperty } from '@/helpers/utils/manufacturing/request_man';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: RequestManProperty;
}
export const useUpdateRequestMan = () => {
  return useMutation({
    mutationKey: ['updateRequestMan ByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `request_man/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

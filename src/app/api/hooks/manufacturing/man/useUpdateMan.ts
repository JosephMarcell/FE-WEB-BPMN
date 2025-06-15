import { useMutation } from '@tanstack/react-query';

import { ManProperty } from '@/helpers/utils/manufacturing/man';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: ManProperty;
}
export const useUpdateMan = () => {
  return useMutation({
    mutationKey: ['updateManByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `man_skill/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

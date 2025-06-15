import { useMutation } from '@tanstack/react-query';

import { PositionProperty } from '@/helpers/utils/hrm/position';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: PositionProperty;
}
export const useUpdatePosition = () => {
  return useMutation({
    mutationKey: ['updatePositionByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `position/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

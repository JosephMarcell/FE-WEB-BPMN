import { useMutation } from '@tanstack/react-query';

import { PresenceWhiteProperty } from '@/helpers/utils/hrm/presence_white';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: PresenceWhiteProperty;
}
export const useUpdatePresenceWhite = () => {
  return useMutation({
    mutationKey: ['updatePresenceWhiteByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `presence_white/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

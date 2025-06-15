import { useMutation } from '@tanstack/react-query';

import { PresenceBlueProperty } from '@/helpers/utils/hrm/presence_blue';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: string | number;
  data: PresenceBlueProperty;
}
export const useUpdatePresenceBlue = () => {
  return useMutation({
    mutationKey: ['updatePresenceBlueByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `presence_blue/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

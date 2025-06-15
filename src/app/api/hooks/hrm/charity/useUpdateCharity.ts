import { useMutation } from '@tanstack/react-query';

import { CharityProperty } from '@/helpers/utils/hrm/charity';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: CharityProperty;
}
export const useUpdateCharity = () => {
  return useMutation({
    mutationKey: ['updateCharityByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `amal/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

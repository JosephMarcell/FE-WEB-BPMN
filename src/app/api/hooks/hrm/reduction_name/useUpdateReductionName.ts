import { useMutation } from '@tanstack/react-query';

import { ReductionNameProperty } from '@/helpers/utils/hrm/reduction_name';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: ReductionNameProperty;
}
export const useUpdateReductionName = () => {
  return useMutation({
    mutationKey: ['updateReductionNameByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.put(
          `reduction_name/${pkid}`,
          data,
        );
        return response.data;
      } catch (error) {
        // Handle the error here
        // throw error;
      }
    },
  });
};

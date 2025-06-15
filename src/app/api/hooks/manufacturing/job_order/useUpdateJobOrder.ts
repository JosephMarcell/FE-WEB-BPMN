import { useMutation } from '@tanstack/react-query';

import { JobOrderProperty } from '@/helpers/utils/manufacturing/job_order';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: JobOrderProperty;
}
export const useUpdateJobOrder = () => {
  return useMutation({
    mutationKey: ['updateJobOrderByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `job_order/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { WorkCentreProperty } from '@/helpers/utils/manufacturing/work_centre';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: WorkCentreProperty;
}
export const useUpdateWorkCentre = () => {
  return useMutation({
    mutationKey: ['updateWorkCentreByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `work_centre/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

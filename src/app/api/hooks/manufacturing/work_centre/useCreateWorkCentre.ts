import { useMutation } from '@tanstack/react-query';

import { WorkCentreProperty } from '@/helpers/utils/manufacturing/work_centre';
import AxiosService from '@/services/axiosService';

export const useCreateWorkCentre = () => {
  return useMutation({
    mutationKey: ['createMan'],
    mutationFn: async (data: WorkCentreProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'work_centre/',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { JobOrderProperty } from '@/helpers/utils/manufacturing/job_order';
import AxiosService from '@/services/axiosService';

export const useCreateJobOrder = () => {
  return useMutation({
    mutationKey: ['createPJobOrder'],
    mutationFn: async (data: JobOrderProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'job_order/',
        data,
      );
      return response.data;
    },
  });
};

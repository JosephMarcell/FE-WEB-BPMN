import { useMutation } from '@tanstack/react-query';

import { ReductionNameProperty } from '@/helpers/utils/hrm/reduction_name';
import AxiosService from '@/services/axiosService';

export const useCreateReductionName = () => {
  return useMutation({
    mutationKey: ['createReductionName'],
    mutationFn: async (data: ReductionNameProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'reduction_name/',
        data,
      );
      return response.data;
    },
  });
};

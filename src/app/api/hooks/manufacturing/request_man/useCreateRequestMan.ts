import { useMutation } from '@tanstack/react-query';

import { RequestManProperty } from '@/helpers/utils/manufacturing/request_man';
import AxiosService from '@/services/axiosService';

export const useCreateRequestMan = () => {
  return useMutation({
    mutationKey: ['createRequestMan '],
    mutationFn: async (data: RequestManProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'request_man/',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { ManProperty } from '@/helpers/utils/manufacturing/man';
import AxiosService from '@/services/axiosService';

export const useCreateMan = () => {
  return useMutation({
    mutationKey: ['createMan'],
    mutationFn: async (data: ManProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'man_skill/',
        data,
      );
      return response.data;
    },
  });
};

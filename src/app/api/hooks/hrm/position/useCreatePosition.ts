import { useMutation } from '@tanstack/react-query';

import { PositionProperty } from '@/helpers/utils/hrm/position';
import AxiosService from '@/services/axiosService';

export const useCreatePosition = () => {
  return useMutation({
    mutationKey: ['createPosition'],
    mutationFn: async (data: PositionProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'position/',
        data,
      );
      return response.data;
    },
  });
};

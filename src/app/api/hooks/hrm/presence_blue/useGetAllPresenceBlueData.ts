import { useMutation } from '@tanstack/react-query';

import { CountHourPresenceWhiteInputProperty } from '@/helpers/utils/hrm/presence_white';
import AxiosService from '@/services/axiosService';

export const useGetAllPresenceBlueData = () => {
  return useMutation({
    mutationKey: ['getAllPresenceBlueData'],
    mutationFn: async (data: CountHourPresenceWhiteInputProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'presence_blue/',
        data,
      );
      return response.data;
    },
  });
};

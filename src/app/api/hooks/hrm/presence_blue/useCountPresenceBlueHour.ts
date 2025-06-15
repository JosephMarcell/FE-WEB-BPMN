import { useMutation } from '@tanstack/react-query';

import { CountHourPresenceWhiteInputProperty } from '@/helpers/utils/hrm/presence_white';
import AxiosService from '@/services/axiosService';

export const useCountPresenceBlueHour = () => {
  return useMutation({
    mutationKey: ['countPresenceBlueHour'],
    mutationFn: async (data: CountHourPresenceWhiteInputProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'presence_blue/hour_count/',
        data,
      );
      return response.data;
    },
  });
};

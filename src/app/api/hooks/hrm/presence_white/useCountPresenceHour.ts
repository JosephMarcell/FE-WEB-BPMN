import { useMutation } from '@tanstack/react-query';

import { CountHourPresenceWhiteInputProperty } from '@/helpers/utils/hrm/presence_white';
import AxiosService from '@/services/axiosService';

export const useCountPresenceHour = () => {
  return useMutation({
    mutationKey: ['countPresenceHour'],
    mutationFn: async (data: CountHourPresenceWhiteInputProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'salary_slip/base_hour_white/',
        data,
      );
      return response.data;
    },
  });
};

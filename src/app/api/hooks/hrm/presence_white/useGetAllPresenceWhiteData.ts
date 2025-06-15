import { useMutation } from '@tanstack/react-query';

import { CountHourPresenceWhiteInputProperty } from '@/helpers/utils/hrm/presence_white';
import AxiosService from '@/services/axiosService';

export const useGetAllPresenceWhiteData = () => {
  return useMutation({
    mutationKey: ['getAllPresenceData'],
    mutationFn: async (data: CountHourPresenceWhiteInputProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'presence_white/data/',
        data,
      );
      return response.data;
    },
  });
};

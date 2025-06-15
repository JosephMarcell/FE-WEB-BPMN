import { useMutation } from '@tanstack/react-query';

import { PresenceWhiteProperty } from '@/helpers/utils/hrm/presence_white';
import AxiosService from '@/services/axiosService';

export const useCreatePresenceWhite = () => {
  return useMutation({
    mutationKey: ['createPresenceWhite'],
    mutationFn: async (data: PresenceWhiteProperty) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'presence_white/',
          data,
        );
        return response.data;
      } catch (error) {
        throw new Error('Error creating Recruitment Request: ');
      }
    },
  });
};

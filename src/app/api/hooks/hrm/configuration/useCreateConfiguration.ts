import { useMutation } from '@tanstack/react-query';

import { ConfigurationProperty } from '@/helpers/utils/hrm/configuration';
import AxiosService from '@/services/axiosService';

export const useCreateConfiguration = () => {
  return useMutation({
    mutationKey: ['createConfiguration'],
    mutationFn: async (data: ConfigurationProperty) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'configuration/',
          data,
        );
        return response.data;
      } catch (error) {
        throw new Error('Error creating Configuration: ');
      }
    },
  });
};

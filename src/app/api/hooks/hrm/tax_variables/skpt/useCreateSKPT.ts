import { useMutation } from '@tanstack/react-query';

import { SKPTProperty } from '@/helpers/utils/hrm/tax_variables/skpt';
import AxiosService from '@/services/axiosService';

export const useCreateSKPT = () => {
  return useMutation({
    mutationKey: ['createSKPT'],
    mutationFn: async (data: SKPTProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post('ptkp/', data);
      return response.data;
    },
  });
};

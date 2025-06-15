import { useMutation } from '@tanstack/react-query';

import { PKPProperty } from '@/helpers/utils/hrm/tax_variables/pkp';
import AxiosService from '@/services/axiosService';

export const useCreatePKP = () => {
  return useMutation({
    mutationKey: ['createPKP'],
    mutationFn: async (data: PKPProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post('pkp/', data);
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { PPHProperty } from '@/helpers/utils/hrm/tax_variables/pph';
import AxiosService from '@/services/axiosService';

export const useCreatePPH = () => {
  return useMutation({
    mutationKey: ['createPPH'],
    mutationFn: async (data: PPHProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'ter_pph/',
        data,
      );
      return response.data;
    },
  });
};

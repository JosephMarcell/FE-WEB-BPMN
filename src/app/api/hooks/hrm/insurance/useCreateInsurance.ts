import { useMutation } from '@tanstack/react-query';

import { InsuranceProperty } from '@/helpers/utils/hrm/insurance';
import AxiosService from '@/services/axiosService';

export const useCreateInsurance = () => {
  return useMutation({
    mutationKey: ['createInsurance'],
    mutationFn: async (data: InsuranceProperty) => {
      const response = await AxiosService.AxiosServiceHRM.post(
        'asuransi/',
        data,
      );
      return response.data;
    },
  });
};

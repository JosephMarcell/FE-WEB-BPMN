import { useMutation } from '@tanstack/react-query';

import { EndOfMonthProperty } from '@/helpers/utils/company/end_of_month';
import AxiosService from '@/services/axiosService';

export const useCreateEndOfMonth = () => {
  return useMutation({
    mutationKey: ['createEndOfMonth'],
    mutationFn: async (data: EndOfMonthProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'endOfMonth/',
        data,
      );
      return response.data;
    },
  });
};

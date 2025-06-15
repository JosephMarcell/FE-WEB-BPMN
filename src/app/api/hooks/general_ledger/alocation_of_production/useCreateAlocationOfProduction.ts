import { useMutation } from '@tanstack/react-query';

import { EndOfMonthProperty } from '@/helpers/utils/company/end_of_month';
import AxiosService from '@/services/axiosService';

export const useCreateAlocationOfProduction = () => {
  return useMutation({
    mutationKey: ['createAlocationOfProduction'],
    mutationFn: async (data: EndOfMonthProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'alocationOfProduction/',
        data,
      );
      return response.data;
    },
  });
};

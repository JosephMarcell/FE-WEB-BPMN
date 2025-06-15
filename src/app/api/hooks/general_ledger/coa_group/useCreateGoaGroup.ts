import { useMutation } from '@tanstack/react-query';

import { CoaGroupProperty } from '@/helpers/utils/general_ledger/coaGroup';
import AxiosService from '@/services/axiosService';

export const useCreateGoaGroup = () => {
  return useMutation({
    mutationKey: ['createAlocationOfProduction'],
    mutationFn: async (data: CoaGroupProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'coaGroup/',
        data,
      );
      return response.data;
    },
  });
};

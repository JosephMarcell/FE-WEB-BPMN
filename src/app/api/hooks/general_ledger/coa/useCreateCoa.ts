import { useMutation } from '@tanstack/react-query';

import { CoaProperty } from '@/helpers/utils/general_ledger/coa';
import AxiosService from '@/services/axiosService';

export const useCreateCoa = () => {
  return useMutation({
    mutationKey: ['createAlocationOfProduction'],
    mutationFn: async (data: CoaProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'coa/',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { FiscalTypeProperty } from '@/helpers/utils/fixed_asset/fiscal_type';
import AxiosService from '@/services/axiosService';

export const useCreateFiscalType = () => {
  return useMutation({
    mutationKey: ['createFiscalType'],
    mutationFn: async (data: FiscalTypeProperty) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        'fiscal_type/',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { InputHppProperty } from '@/helpers/utils/general_ledger/hppReport';
import AxiosService from '@/services/axiosService';

export const useGetHppReport = () => {
  return useMutation({
    mutationKey: ['hppReport'],
    mutationFn: async (data: InputHppProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'accountingReport/hpp/',
        data,
      );
      return response.data.data;
    },
  });
};

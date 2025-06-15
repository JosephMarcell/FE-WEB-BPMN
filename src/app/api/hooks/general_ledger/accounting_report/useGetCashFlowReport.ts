import { useMutation } from '@tanstack/react-query';

import { InputCashFlowProperty } from '@/helpers/utils/general_ledger/cashFlowReport';
import AxiosService from '@/services/axiosService';

export const useGetCashFlowReport = () => {
  return useMutation({
    mutationKey: ['cashFlowReport'],
    mutationFn: async (data: InputCashFlowProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'accountingReport/cashflow/',
        data,
      );
      return response.data.data;
    },
  });
};

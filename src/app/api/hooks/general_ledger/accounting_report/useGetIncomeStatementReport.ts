import { useMutation } from '@tanstack/react-query';

import { InputIncomeStatementProperty } from '@/helpers/utils/general_ledger/incomeStatementReport';
import AxiosService from '@/services/axiosService';

export const useGetIncomeStatementReport = () => {
  return useMutation({
    mutationKey: ['IncomeStatementReport'],
    mutationFn: async (data: InputIncomeStatementProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'accountingReport/incomeStatement/',
        data,
      );
      return response.data.data;
    },
  });
};

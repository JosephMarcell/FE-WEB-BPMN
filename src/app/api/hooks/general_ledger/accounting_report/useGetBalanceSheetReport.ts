import { useMutation } from '@tanstack/react-query';

import { InputBalanceSheetReport } from '@/helpers/utils/general_ledger/balanceSheetReport';
import AxiosService from '@/services/axiosService';

export const useGetBalanceSheetReport = () => {
  return useMutation({
    mutationKey: ['balanceSheetReport'],
    mutationFn: async (data: InputBalanceSheetReport) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'accountingReport/balancesheet/',
        data,
      );
      return response.data.data;
    },
  });
};

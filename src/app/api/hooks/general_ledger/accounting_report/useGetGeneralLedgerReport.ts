import { useMutation } from '@tanstack/react-query';

import { InputGeneralLedgerProperty } from '@/helpers/utils/general_ledger/general_ledger';
import AxiosService from '@/services/axiosService';

export const useGetGeneralLedgerReport = () => {
  return useMutation({
    mutationKey: ['generalLedgerReport'],
    mutationFn: async (data: InputGeneralLedgerProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'accountingReport/generalledger/',
        data,
      );
      return response.data.data;
    },
  });
};

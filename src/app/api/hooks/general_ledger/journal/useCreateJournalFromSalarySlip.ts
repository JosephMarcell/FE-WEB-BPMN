import { useMutation } from '@tanstack/react-query';

import { JournalProperty } from '@/helpers/utils/general_ledger/journal';
import AxiosService from '@/services/axiosService';

export const useCreateJournalFromSalarySlip = () => {
  return useMutation({
    mutationKey: ['createJournalFromSalarySlip'],
    mutationFn: async (data: JournalProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'automateJournalCreation/fromSalarySlip',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { JournalProperty } from '@/helpers/utils/general_ledger/journal';
import AxiosService from '@/services/axiosService';

export const useCreateJournalPaySalarySlip = () => {
  return useMutation({
    mutationKey: ['createJournalPaySalarySlip'],
    mutationFn: async (data: JournalProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'automateJournalCreation/paySalarySlip',
        data,
      );
      return response.data;
    },
  });
};

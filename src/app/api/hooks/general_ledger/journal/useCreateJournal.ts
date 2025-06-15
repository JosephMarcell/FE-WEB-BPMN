import { useMutation } from '@tanstack/react-query';

import { JournalProperty } from '@/helpers/utils/general_ledger/journal';
import AxiosService from '@/services/axiosService';

export const useCreateJournal = () => {
  return useMutation({
    mutationKey: ['createJournal'],
    mutationFn: async (data: JournalProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'journal/',
        data,
      );
      return response.data;
    },
  });
};

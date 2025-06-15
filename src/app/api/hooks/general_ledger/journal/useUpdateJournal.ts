import { useMutation } from '@tanstack/react-query';

import { JournalProperty } from '@/helpers/utils/general_ledger/journal';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: JournalProperty;
}
export const useUpdateJournal = () => {
  return useMutation({
    mutationKey: ['createJournal'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.put(
        `journal/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

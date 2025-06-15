import { useQuery } from '@tanstack/react-query';

import { JournalDetailProperty } from '@/helpers/utils/general_ledger/journalDetail';
import AxiosService from '@/services/axiosService';

export const useGetJournalByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        `journal/${pkid}`,
      );
      data.data.JournalDetails = data.data.JournalDetails.map(
        (item: JournalDetailProperty) => {
          return {
            credit: item.credit,
            credit_curr: item.credit_curr,
            debit: item.debit,
            debit_curr: item.debit_curr,
            coa_pkid: item.coa_pkid,
            name: item.Coa?.name,
            number: item.Coa?.number,
            pkid: item.pkid,
          };
        },
      );
      return data.data;
    },
    enabled: enabled,
  });
};

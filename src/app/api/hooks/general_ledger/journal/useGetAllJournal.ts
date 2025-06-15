import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllJournal = () => {
  return useQuery({
    queryKey: ['listJournal'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        'journal/',
      );
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllEndOfMonth = () => {
  return useQuery({
    queryKey: ['listEndOfMonth'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        'endOfMonth/',
      );
      return data.data;
    },
  });
};

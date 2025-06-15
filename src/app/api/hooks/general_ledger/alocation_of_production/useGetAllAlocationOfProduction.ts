import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAlocationOfProduction = () => {
  return useQuery({
    queryKey: ['listAlocationOfProduction'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        'alocationOfProduction/',
      );
      return data.data;
    },
  });
};

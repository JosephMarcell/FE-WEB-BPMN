import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCurrency = () => {
  return useQuery({
    queryKey: ['listCurrency'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        'currency/',
      );
      return data.data;
    },
  });
};

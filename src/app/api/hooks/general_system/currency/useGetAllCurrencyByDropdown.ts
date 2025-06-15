import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCurrencyByDropdown = () => {
  return useQuery({
    queryKey: ['listCurrencyByDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        'currency/dropdown/',
      );
      return data.data;
    },
  });
};

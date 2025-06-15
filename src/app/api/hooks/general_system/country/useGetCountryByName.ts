import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCountryByName = () => {
  return useQuery({
    queryKey: ['listCountry'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        'country/by-name',
      );
      return data.data;
    },
  });
};

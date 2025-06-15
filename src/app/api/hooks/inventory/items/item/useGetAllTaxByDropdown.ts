import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllTaxByDropdown = () => {
  return useQuery({
    queryKey: ['listTaxByDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        'tax/dropdown/',
      );
      return data.data;
    },
  });
};

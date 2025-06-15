import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllFiscalType = () => {
  return useQuery({
    queryKey: ['listFiscalType'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        'fiscal_type/',
      );
      return data.data;
    },
  });
};

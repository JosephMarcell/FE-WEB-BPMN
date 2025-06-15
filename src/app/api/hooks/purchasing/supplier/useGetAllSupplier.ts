import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllSupplier = () => {
  return useQuery({
    queryKey: ['listSupplier'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'supplier/',
      );
      return data.data;
    },
  });
};

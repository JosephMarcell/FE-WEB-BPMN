import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSupplierForDropdown = () => {
  return useQuery({
    queryKey: ['listSupplierDropdown'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'supplier/dropdown',
      );
      return data.data;
    },
  });
};

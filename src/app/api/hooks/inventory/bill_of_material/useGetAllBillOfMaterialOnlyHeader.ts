import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllBillOfMaterialOnlyHeader = () => {
  return useQuery({
    queryKey: ['listBillOfMaterialOnlyHeader'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'bom/headers',
      );

      return data.data;
    },
  });
};

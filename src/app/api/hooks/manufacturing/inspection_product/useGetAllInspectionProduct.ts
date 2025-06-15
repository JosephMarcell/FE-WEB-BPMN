import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllInspectionProduct = () => {
  return useQuery({
    queryKey: ['listInspectionProduct'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'inspection_product/',
      );
      return data.data;
    },
  });
};

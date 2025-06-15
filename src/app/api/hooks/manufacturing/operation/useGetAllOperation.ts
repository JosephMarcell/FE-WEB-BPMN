import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllOperation = () => {
  return useQuery({
    queryKey: ['listOperation'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'operation/',
      );
      return data.data;
    },
  });
};

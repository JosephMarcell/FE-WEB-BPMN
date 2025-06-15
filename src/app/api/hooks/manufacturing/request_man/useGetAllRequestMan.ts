import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllRequestMan = () => {
  return useQuery({
    queryKey: ['listRequestman'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'request_man/',
      );
      return data.data;
    },
  });
};

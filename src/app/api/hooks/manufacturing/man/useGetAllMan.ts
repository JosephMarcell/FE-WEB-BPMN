import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllMan = () => {
  return useQuery({
    queryKey: ['listMan'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'man_skill/',
      );
      return data.data;
    },
  });
};

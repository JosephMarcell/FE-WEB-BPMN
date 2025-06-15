import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllMachine = () => {
  return useQuery({
    queryKey: ['listMachine'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'machine/',
      );
      return data.data;
    },
  });
};

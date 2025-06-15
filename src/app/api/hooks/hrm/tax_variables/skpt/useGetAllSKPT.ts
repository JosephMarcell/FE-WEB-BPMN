import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllSKPT = () => {
  return useQuery({
    queryKey: ['listSKPT'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get('ptkp/');
      return { data: data.data, headers };
    },
  });
};

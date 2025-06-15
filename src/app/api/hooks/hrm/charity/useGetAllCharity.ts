import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCharity = () => {
  return useQuery({
    queryKey: ['listCharity'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get('amal/');
      return { headers, data: data.data };
    },
  });
};

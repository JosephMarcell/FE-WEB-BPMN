import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllPKP = () => {
  return useQuery({
    queryKey: ['listPKP'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get('pkp/');
      return data.data;
    },
  });
};

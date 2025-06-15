import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllViolations = () => {
  return useQuery({
    queryKey: ['violations'],
    queryFn: async () => {
      const url = '/violations';
      const { data } = await AxiosService.AxiosServiceViolations.get(url);
      return data.data.data;
    },
  });
};

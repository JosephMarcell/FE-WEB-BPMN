import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllOvertime = () => {
  return useQuery({
    queryKey: ['listOvetime'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get('overtime/');
      return data.data;
    },
  });
};

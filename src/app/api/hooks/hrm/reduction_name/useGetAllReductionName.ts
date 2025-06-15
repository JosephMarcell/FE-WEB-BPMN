import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllReductionName = () => {
  return useQuery({
    queryKey: ['listReductionName'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'reduction_name/',
      );
      return { data: data.data, headers };
    },
  });
};

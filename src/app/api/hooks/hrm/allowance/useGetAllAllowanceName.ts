import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAllowanceName = () => {
  return useQuery({
    queryKey: ['listAllowanceName'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        'allowance_name/',
      );
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllJobOrder = () => {
  return useQuery({
    queryKey: ['listJobOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'job_order/',
      );
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllWorkCentre = () => {
  return useQuery({
    queryKey: ['listWorkCentre'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'work_centre/',
      );
      return data.data;
    },
  });
};

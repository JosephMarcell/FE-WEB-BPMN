import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllProvince = () => {
  return useQuery({
    queryKey: ['listProvince'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        'regionIndonesia/provinces',
      );
      return data.data;
    },
  });
};

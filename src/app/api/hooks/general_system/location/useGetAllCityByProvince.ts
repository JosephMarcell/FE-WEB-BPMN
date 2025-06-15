import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCityByProvince = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        `regionIndonesia/provinces/${pkid}/cities`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCitiesByProvince = (kode_provinsi: string | number) => {
  return useQuery({
    queryKey: [kode_provinsi],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralSystem.get(
        `regionIndonesia/provinces/${kode_provinsi}/cities/`,
      );
      return data.data;
    },
  });
};

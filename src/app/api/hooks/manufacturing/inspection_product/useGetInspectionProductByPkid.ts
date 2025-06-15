import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetInspectionProductByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid, 'inspection_product'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `inspection_product/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

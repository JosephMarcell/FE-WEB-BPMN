import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetBillOfMaterialByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: ['BOM Detail', pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `bom/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

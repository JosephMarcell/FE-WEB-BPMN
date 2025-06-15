import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPurchaseRequestByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        `purchaseRequest/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

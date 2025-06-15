import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllJobOrderDetailByJobOrderPkid = (
  pkid: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['listJobOrderDetail'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `job_order/${pkid}`,
      );

      return data.data;
    },
    enabled: enabled,
  });
};

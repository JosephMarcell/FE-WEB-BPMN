import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllProductionRequestByStatus = (
  status: string,
  enabled = true,
) => {
  return useQuery({
    queryKey: [status],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        `production_request/dropdown/status/${status}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

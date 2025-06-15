import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetViolationById = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const url = `/violations/${pkid}`;
      const { data } = await AxiosService.AxiosServiceViolations.get(url);
      return data.data;
    },
    enabled: enabled,
  });
};

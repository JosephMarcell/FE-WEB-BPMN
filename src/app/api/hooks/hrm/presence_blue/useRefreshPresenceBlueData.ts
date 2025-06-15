import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useRefreshPresenceBlueData = () => {
  return useQuery({
    queryKey: ['refreshPresenceBlueData'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        'presence_blue/refresh',
      );
      return data.data;
    },
    enabled: false,
  });
};

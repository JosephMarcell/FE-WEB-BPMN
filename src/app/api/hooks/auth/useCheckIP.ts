import { useQuery } from '@tanstack/react-query';

import IpifyService from '@/services/ipifyService';

export const useCheckIP = () => {
  return useQuery({
    queryKey: ['checkIP'],
    queryFn: async () => {
      const response = await IpifyService.AxiosServiceIpify.get('/');
      return response.data;
    },
  });
};

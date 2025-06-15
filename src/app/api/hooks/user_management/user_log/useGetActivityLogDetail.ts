import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetActivityLogDetail = (
  pkid: number | null,
  enabled = true,
) => {
  return useQuery({
    queryKey: ['userDetail', pkid],
    queryFn: async () => {
      if (!pkid) {
        throw new Error('Invalid pkid');
      }
      const { data } = await AxiosService.AxiosServiceUserManagement.get(
        `/log/get-log-summary/${pkid}`,
      );

      return data?.data || {};
    },
    enabled: enabled && !!pkid,
  });
};

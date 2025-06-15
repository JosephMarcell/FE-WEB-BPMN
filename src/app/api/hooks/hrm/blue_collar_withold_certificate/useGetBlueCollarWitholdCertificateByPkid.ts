import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetBlueCollarWitholdCertificateByPkid = (
  pkid?: string | number,
) => {
  const url = pkid ? `bukpot_blue/${pkid}` : 'bukpot_blue';
  return useQuery({
    queryKey: pkid ? ['bukpot_blue', pkid] : ['bukpot_blue'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(url);
      return { data: data.data, headers };
    },
    enabled: !!pkid,
  });
};

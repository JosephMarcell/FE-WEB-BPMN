import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetWhiteCollarWitholdCertificateByPkid = (
  pkid?: string | number,
) => {
  const url = pkid ? `bukpot/${pkid}` : 'bukpot';
  return useQuery({
    queryKey: pkid ? ['bukpot', pkid] : ['bukpot'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(url);
      return { data: data.data, headers };
    },
    enabled: !!pkid,
  });
};

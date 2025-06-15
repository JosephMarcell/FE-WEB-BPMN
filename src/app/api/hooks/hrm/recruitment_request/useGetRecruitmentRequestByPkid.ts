import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetRecruitmentRequestByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `recruitment_request/${pkid}`,
      );
      return data.data;
    },
    enabled: !!pkid,
  });
};

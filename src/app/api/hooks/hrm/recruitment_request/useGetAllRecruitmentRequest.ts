import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllRecruitmentRequest = () => {
  return useQuery({
    queryKey: ['listRecruitmentRequest'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'recruitment_request/',
      );
      return { data: data.data, headers };
    },
  });
};

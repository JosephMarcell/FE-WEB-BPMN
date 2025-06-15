import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useFetchProfile = () => {
  return useQuery({
    queryKey: ['listUser'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceUserManagement.get(
        '/user/me',
      );
      return data.data;
    },
  });
};

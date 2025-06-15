import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPermissionByToken = () => {
  return useQuery({
    queryKey: ['tokenPermission'],
    queryFn: async () => {
      const response = await AxiosService.AxiosServiceUserManagement.get(
        'permission/token',
      );
      return response.data;
    },
    retryOnMount: false,
  });
};

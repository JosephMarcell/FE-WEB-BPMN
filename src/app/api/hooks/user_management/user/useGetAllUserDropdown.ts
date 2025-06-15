import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllUserDropdown = () => {
  return useQuery({
    queryKey: ['management'],
    queryFn: async () => {
      const url = '/management/user-dropdown';
      const { data } = await AxiosService.AxiosServiceUserManagement.get(url);
      return data.data.data;
    },
  });
};

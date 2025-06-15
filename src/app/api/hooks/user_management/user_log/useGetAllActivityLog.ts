import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export const useGetAllActivityLog = () => {
  return useQuery({
    queryKey: ['listActivityLog'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceUserManagement.get(
        '/log/get-log-summary',
      );

      const userRole = Cookies.get('userRole');

      if (userRole !== 'Superadmin' && userRole !== 'Admin') {
        return null;
      }

      return data.data;
    },
  });
};

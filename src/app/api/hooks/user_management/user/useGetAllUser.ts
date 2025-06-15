import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export const useGetAllUser = () => {
  // Get user role from cookies
  const userRole = Cookies.get('userRole');

  // If user is not SUPERADMIN or ADMIN, don't fetch users
  const enabled = userRole === 'SUPERADMIN' || userRole === 'ADMIN';

  return useQuery({
    queryKey: ['listUser'],
    queryFn: async () => {
      let data;
      if (userRole === 'SUPERADMIN') {
        const res = await AxiosService.AxiosServiceUserManagement.get(
          '/api/admin/users',
        );
        data = res.data;
      } else if (userRole === 'ADMIN') {
        const res = await AxiosService.AxiosServiceUserManagement.get(
          '/api/tenant/users',
        );
        data = res.data;
      } else {
        return { data: [] };
      }

      // Perbaikan di sini: Gunakan langsung field role dari API
      return {
        ...data,
        data: data.data.map((user: any) => ({
          ...user,
          // username: user.user_name, // jika perlu mapping username
        })),
      };
    },
    enabled,
  });
};

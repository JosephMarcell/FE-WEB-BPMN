import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export interface TenantUser {
  id: string;
  username: string;
  email: string;
  user_role: string;
  is_verified: boolean;
}

export interface AdminTenantUsersResponse {
  data: TenantUser[];
  meta?: {
    last_page: number;
    limit: number;
    page: number;
    total: number;
  };
}

export const useGetAdminTenantUsers = () => {
  const userRole = Cookies.get('userRole');

  // Only ADMIN can use this hook
  const enabled = userRole === 'ADMIN';

  return useQuery<AdminTenantUsersResponse, Error>({
    queryKey: ['adminTenantUsers'],
    queryFn: async () => {
      if (!enabled) {
        throw new Error('Unauthorized: Only admin can access this resource');
      }

      const response = await AxiosService.AxiosServiceUserManagement.get(
        '/api/admin/tenants/users',
      );
      return response.data;
    },
    enabled,
  });
};

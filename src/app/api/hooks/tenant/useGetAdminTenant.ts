import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export interface AdminTenant {
  id: string;
  name: string;
  description: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  subscription_plan: string;
  subscription_start_date: string;
  subscription_end_date: string;
  max_users: number;
  is_active: boolean;
}

export interface AdminTenantResponse {
  data: AdminTenant;
}

export const useGetAdminTenant = () => {
  const userRole = Cookies.get('userRole');

  // Only ADMIN can use this hook
  const enabled = userRole === 'ADMIN';

  return useQuery<AdminTenantResponse>({
    queryKey: ['adminTenant'],
    queryFn: async () => {
      if (!enabled) {
        throw new Error('Unauthorized: Only admin can access this resource');
      }

      const response = await AxiosService.AxiosServiceUserManagement.get(
        '/api/admin/tenants',
      );
      return response.data;
    },
    enabled,
  });
};

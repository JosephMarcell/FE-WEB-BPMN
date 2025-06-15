import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export interface Tenant {
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

export interface TenantsResponse {
  data: Tenant[];
  meta?: {
    page: number;
    page_size: number;
    total: number;
  };
}

export const useGetAllTenants = () => {
  // Get user role from cookies
  const userRole = Cookies.get('userRole');

  // Only SUPERADMIN can fetch all tenants
  const enabled = userRole === 'SUPERADMIN';

  return useQuery<TenantsResponse>({
    queryKey: ['tenants'],
    queryFn: async () => {
      if (userRole !== 'SUPERADMIN') {
        return { data: [] };
      }

      const res = await AxiosService.AxiosServiceUserManagement.get(
        '/api/superadmin/tenants',
      );
      return res.data;
    },
    enabled,
  });
};

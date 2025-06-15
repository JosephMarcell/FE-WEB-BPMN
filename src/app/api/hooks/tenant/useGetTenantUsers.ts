import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export interface TenantUser {
  id: string;
  username: string;
  email: string;
  user_role: string;
  is_verified: boolean;
}

export interface TenantUsersResponse {
  data: TenantUser[];
  meta?: {
    last_page: number;
    limit: number;
    page: number;
    total: number;
  };
}

export const useGetTenantUsers = (tenantId: string) => {
  return useQuery<TenantUsersResponse, Error>({
    queryKey: ['tenantUsers', tenantId],
    queryFn: async () => {
      if (!tenantId) {
        return { data: [] };
      }

      try {
        // Use the actual API endpoint
        const res = await AxiosService.AxiosServiceUserManagement.get(
          `/api/superadmin/tenants/${tenantId}/users`,
        );
        return res.data;
      } catch (error: any) {
        // Handle "User tidak berada dalam tenant ini" error
        if (
          error.response &&
          error.response.data &&
          error.response.data.error
        ) {
          console.error('Tenant user fetch error:', error.response.data.error);
          // Return empty array but don't throw error to prevent UI breaking
          return { data: [] };
        }
        throw error; // Re-throw other errors
      }
    },
    enabled: !!tenantId,
  });
};

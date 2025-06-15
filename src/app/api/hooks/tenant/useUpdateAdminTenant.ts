import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UpdateTenantData {
  name: string;
  description: string;
  logoURL: string;
  contactEmail: string;
  contactPhone: string;
}

export const useUpdateAdminTenant = () => {
  return useMutation({
    mutationKey: ['updateAdminTenant'],
    mutationFn: async (data: UpdateTenantData) => {
      const response = await AxiosService.AxiosServiceUserManagement.put(
        '/api/admin/tenants',
        data,
      );
      return response.data;
    },
  });
};

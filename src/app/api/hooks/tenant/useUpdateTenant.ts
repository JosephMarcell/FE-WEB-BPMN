import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

interface UpdateTenantData {
  name: string;
  description: string;
  logo_url?: string;
  contact_email: string;
  contact_phone?: string;
  max_users: number;
}

export const useUpdateTenant = (tenantId: string) => {
  const userRole = Cookies.get('userRole');

  return useMutation({
    mutationFn: async (data: UpdateTenantData) => {
      // Map field names to match API expectations - make sure field names exactly match what the backend expects
      const mappedData = {
        name: data.name,
        description: data.description,
        logoURL: data.logo_url, // Convert snake_case to camelCase for API (note the exact casing)
        contactEmail: data.contact_email, // Convert snake_case to camelCase for API
        contactPhone: data.contact_phone, // Convert snake_case to camelCase for API
        max_users: data.max_users, // This field name remains the same
      };

      console.log('Sending update data:', mappedData); // Add debug logging

      // Choose the appropriate endpoint based on user role
      const endpoint =
        userRole === 'SUPERADMIN'
          ? `/api/superadmin/tenants/${tenantId}` // Superadmin endpoint
          : `/api/tenant`; // Normal tenant endpoint

      // Use authorization header if needed for superadmin
      const headers =
        userRole === 'SUPERADMIN'
          ? {
              // Add any special headers needed for superadmin authorization
            }
          : {};

      const response = await AxiosService.AxiosServiceUserManagement.put(
        endpoint,
        mappedData,
        { headers },
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export const useDeleteTenant = () => {
  return useMutation({
    mutationKey: ['deleteTenant'],
    mutationFn: async (tenantId: string) => {
      const token = Cookies.get('authToken');

      console.log('Deleting tenant with ID:', tenantId);
      console.log('Using token:', token ? 'Token exists' : 'No token');

      const response = await AxiosService.AxiosServiceUserManagement.delete(
        `/api/tenants/${tenantId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return response.data;
    },
  });
};

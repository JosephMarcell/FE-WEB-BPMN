import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useRemoveUserFromTenant = () => {
  return useMutation({
    mutationKey: ['removeUserFromTenant'],
    mutationFn: async ({
      tenantId,
      userId,
    }: {
      tenantId: string;
      userId: string;
    }) => {
      // Using the correct API endpoint
      const response = await AxiosService.AxiosServiceUserManagement.delete(
        `/api/superadmin/tenants/${tenantId}/users/${userId}`,
      );
      return response.data;
    },
  });
};

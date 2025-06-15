import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useInviteUserToTenant = () => {
  return useMutation({
    mutationKey: ['inviteUserToTenant'],
    mutationFn: async ({
      tenantId,
      userId,
    }: {
      tenantId: string;
      userId: string;
    }) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        `/api/superadmin/tenants/${tenantId}/users/${userId}/invite`,
      );
      return response.data;
    },
  });
};

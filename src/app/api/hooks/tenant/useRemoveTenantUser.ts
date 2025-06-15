import { useMutation, useQueryClient } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useRemoveTenantUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['removeTenantUser'],
    mutationFn: async (userId: string) => {
      console.log(`Removing user ${userId} from tenant`);

      const response = await AxiosService.AxiosServiceUserManagement.delete(
        `/api/admin/tenants/users/${userId}`,
      );

      return response.data;
    },
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['adminTenantUsers'] });
    },
  });
};

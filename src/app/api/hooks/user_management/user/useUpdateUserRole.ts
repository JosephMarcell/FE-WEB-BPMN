import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UpdateUserRolePayload {
  userId: string;
  role: 'USER' | 'ADMIN';
}

export const useUpdateUserRole = () => {
  return useMutation({
    mutationKey: ['updateUserRole'],
    mutationFn: async ({ userId, role }: UpdateUserRolePayload) => {
      const response = await AxiosService.AxiosServiceUserManagement.put(
        `/api/admin/users/${userId}/role`,
        { role },
      );
      return response.data;
    },
  });
};

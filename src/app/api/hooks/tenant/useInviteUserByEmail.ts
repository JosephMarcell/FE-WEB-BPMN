import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface InviteUserByEmailData {
  email: string;
}

export const useInviteUserByEmail = () => {
  return useMutation({
    mutationKey: ['inviteUserByEmail'],
    mutationFn: async (data: InviteUserByEmailData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/admin/tenants/invite',
        data,
      );
      return response.data;
    },
  });
};

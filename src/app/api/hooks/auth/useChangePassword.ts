import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface ChangePasswordData {
  old_password: string;
  new_password: string;
  confirm_pwd: string;
}

export const useChangePassword = () => {
  return useMutation({
    mutationKey: ['changePassword'],
    mutationFn: async (data: ChangePasswordData) => {
      const response = await AxiosService.AxiosServiceUserManagement.patch(
        '/user/change-password',
        data,
      );
      return response.data;
    },
  });
};

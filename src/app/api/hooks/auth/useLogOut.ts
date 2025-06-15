import { useMutation } from '@tanstack/react-query';

import { LogOutProperty } from '@/helpers/utils/auth/log_out';
import AxiosService from '@/services/axiosService';

export const useLogOut = () => {
  return useMutation({
    mutationKey: ['logOut'],
    mutationFn: async (data: LogOutProperty) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/auth/logout',
        data,
      );
      return response.data;
    },
  });
};

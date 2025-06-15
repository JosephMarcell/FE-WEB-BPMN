import { useMutation } from '@tanstack/react-query';

import { CheckCredentialProperty } from '@/helpers/utils/auth/check_credential';
import AxiosService from '@/services/axiosService';

export const useCheckCredential = () => {
  return useMutation({
    mutationKey: ['checkCredential'],
    mutationFn: async (data: CheckCredentialProperty) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        'auth/get_credential',
        data,
      );
      return response.data;
    },
  });
};

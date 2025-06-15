import { useMutation } from '@tanstack/react-query';

import { IssueMaterialProperty } from '@/helpers/utils/manufacturing/issue_material';
import AxiosService from '@/services/axiosService';

export const useCreateIssueMaterial = () => {
  return useMutation({
    mutationKey: ['createIssueMaterial'],
    mutationFn: async (data: IssueMaterialProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'issue_material/',
        data,
      );
      return response.data;
    },
  });
};

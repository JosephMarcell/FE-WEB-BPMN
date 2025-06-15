import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveIssueMaterial = () => {
  return useMutation({
    mutationKey: ['approveIssueMaterial'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `issue_material/approve/${pkid}`,
      );
      return response.data;
    },
  });
};

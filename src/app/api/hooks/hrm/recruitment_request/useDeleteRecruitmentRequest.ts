import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteRecruitmentRequest = () => {
  return useMutation({
    mutationKey: ['deleteRecruitmentRequest'],
    mutationFn: async (pkid: string | number) => {
      const response = await AxiosService.AxiosServiceHRM.delete(
        `recruitment_request/${pkid}`,
      );
      return response.data;
    },
  });
};

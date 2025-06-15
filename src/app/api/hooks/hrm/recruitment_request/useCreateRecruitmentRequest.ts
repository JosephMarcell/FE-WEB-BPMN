import { useMutation } from '@tanstack/react-query';

import { RecruitmentRequestProperty } from '@/helpers/utils/hrm/recruitment_request';
import AxiosService from '@/services/axiosService';

export const useCreateRecruitmentRequest = () => {
  return useMutation({
    mutationKey: ['createRecruitmentRequest'],
    mutationFn: async (data: RecruitmentRequestProperty) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'recruitment_request/',
          data,
        );
        return response.data;
      } catch (error) {
        throw new Error('Error creating Recruitment Request: ');
      }
    },
  });
};

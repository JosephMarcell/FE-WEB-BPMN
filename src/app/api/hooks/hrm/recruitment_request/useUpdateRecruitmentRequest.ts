import { useMutation } from '@tanstack/react-query';

import { RecruitmentRequestProperty } from '@/helpers/utils/hrm/recruitment_request';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: RecruitmentRequestProperty;
}
export const useUpdateRecruitmentRequest = () => {
  return useMutation({
    mutationKey: ['updateRecruitmentRequestByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `recruitment_request/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

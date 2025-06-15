import { useMutation } from '@tanstack/react-query';

import { OvertimeProperty } from '@/helpers/utils/hrm/overtime';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: string | number;
  data: OvertimeProperty;
}

export const useUpdateOvertime = () => {
  return useMutation({
    mutationKey: ['updateOvertimeByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `overtime/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

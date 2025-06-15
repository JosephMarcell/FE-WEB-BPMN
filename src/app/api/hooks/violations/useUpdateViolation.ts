import { useMutation } from '@tanstack/react-query';

import { updateViolationProps } from '@/helpers/utils/violations/violation';
import AxiosService from '@/services/axiosService';

export const useUpdateViolation = () => {
  return useMutation({
    mutationKey: ['updateViolation  '],
    mutationFn: async ({
      pkid,
      data,
    }: {
      pkid: number;
      data: updateViolationProps;
    }) => {
      const url = `/violations/${pkid}`;
      const response = await AxiosService.AxiosServiceViolations.put(url, data);
      return response.data;
    },
  });
};

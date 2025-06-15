import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteMedia = () => {
  return useMutation({
    mutationKey: ['deleteMedia'],
    mutationFn: async ({
      pkid,
      mediaIds,
    }: {
      pkid: number;
      mediaIds: number[];
    }) => {
      const url = `/violations/${pkid}/media?Pkid=${mediaIds.join(',')}`;
      const response = await AxiosService.AxiosServiceViolations.delete(url);
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface DeleteData {
  purpose: string;
  destination: string;
  pkid: number;
}

export const useDeleteWithLog = () => {
  return useMutation({
    mutationKey: ['deleteWithLog'],
    mutationFn: async ({ purpose, pkid, destination }: DeleteData) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        `/assets/${pkid}/delete-log`,
        { purpose, destination },
      );
      return response.data;
    },
  });
};

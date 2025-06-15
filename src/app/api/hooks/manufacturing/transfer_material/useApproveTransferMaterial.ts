import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useApproveTransferMaterial = () => {
  return useMutation({
    mutationKey: ['approveTransferMaterial'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `transfer_material/approve/${pkid}`,
      );
      return response.data;
    },
  });
};

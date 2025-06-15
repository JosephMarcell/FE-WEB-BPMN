import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useSoftDeleteAssetMaintenanceLog = () => {
  return useMutation({
    mutationKey: ['deleteAsset'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/assets/maintenance-log/${pkid}/soft-delete`,
      );
      return response.data;
    },
  });
};

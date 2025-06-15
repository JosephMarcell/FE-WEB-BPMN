import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface CreateAssetMaintenanceLog {
  maintenance_start: string;
  maintenance_end: string;
  maintenance_type: string;
  status: string;
  description: string | null;
}

export const useCreateAssetMaintenance = (pkid: string) => {
  return useMutation({
    mutationKey: ['createAssetMaintenance'],
    mutationFn: async (data: CreateAssetMaintenanceLog) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        `assets/${pkid}/maintenance-log`,
        data,
      );
      return response.data;
    },
  });
};

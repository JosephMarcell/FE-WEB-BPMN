import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface AssetCreateData {
  asset_code: string;
  asset_type: string;
  purchase_date: string;
  condition: string;
  status: string;
  description: string | null;
  age: number | 1;
  specification: string | null;
  manufacturer: string | null;
}

export const useCreateAsset = () => {
  return useMutation({
    mutationKey: ['createAsset'],
    mutationFn: async (data: AssetCreateData) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        '/assets',
        data,
      );
      return response.data;
    },
  });
};

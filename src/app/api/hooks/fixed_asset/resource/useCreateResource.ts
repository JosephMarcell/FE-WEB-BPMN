import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface ResourceCreateData {
  asset_pkid: number | null;
  resource_name: string | null;
  resource_latitude: number | null;
  resource_longitude: number | null;
  description: string | null;
}

export const useCreateResource = () => {
  return useMutation({
    mutationKey: ['createResource'],
    mutationFn: async (data: ResourceCreateData) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        '/resources',
        data,
      );
      return response.data;
    },
  });
};

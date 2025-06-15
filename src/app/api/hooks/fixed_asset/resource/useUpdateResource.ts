import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UpdateResourceData {
  resource_latitude: number | null;
  resource_longitude: number | null;
  description: string | null;
}

interface Update {
  pkid: number;
  data: UpdateResourceData;
}
export const useUpdateResource = () => {
  return useMutation({
    mutationKey: ['updateResourceByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/resources/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

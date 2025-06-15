import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAssetDisposalByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `asset_disposal/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

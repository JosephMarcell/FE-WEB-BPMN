import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAssetRevaluationByPkid = (pkid: number, enabled = true) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `asset_revaluation/${pkid}`,
      );
      return data.data;
    },
    enabled: enabled,
  });
};

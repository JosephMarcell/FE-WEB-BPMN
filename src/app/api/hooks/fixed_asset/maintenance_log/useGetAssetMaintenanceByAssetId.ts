import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAssetMaintenanceByPkid = (
  model_pkid: number,
  enabled = true,
) => {
  return useQuery({
    queryKey: [model_pkid],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `assets/maintenance-log/${model_pkid}`,
      );
      return data.data.length > 0 ? data.data[0] : null;
    },
    enabled: enabled,
  });
};

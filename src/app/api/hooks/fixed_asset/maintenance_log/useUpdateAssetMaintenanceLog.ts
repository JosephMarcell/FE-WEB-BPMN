import { useMutation } from '@tanstack/react-query';

import { AssetMaintenanceLogProperty } from '@/helpers/utils/fixed_asset/asset_maintenance_log';
import AxiosService from '@/services/axiosService';
interface Update {
  log_pkid: number;
  data: AssetMaintenanceLogProperty;
}
export const useUpdateAssetMaintenanceLog = (log_pkid: number) => {
  return useMutation({
    mutationKey: ['updateAssetByPkid'],
    mutationFn: async ({ data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/assets/maintenance-log/${log_pkid}`,
        data,
      );
      return response.data;
    },
  });
};

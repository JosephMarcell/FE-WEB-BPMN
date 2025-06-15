import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useBulkUpdateTransferMaterialByProductionOrderPkid = () => {
  return useMutation({
    mutationKey: ['bulkUpdateTransferMaterial'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `transfer_material/bulk_update/${pkid}`,
      );
      return response.data;
    },
  });
};

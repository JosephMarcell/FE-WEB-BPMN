import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useBulkUpdateIssueMaterialByProductionOrderPkid = () => {
  return useMutation({
    mutationKey: ['bulkUpdateIssueMaterial'],
    mutationFn: async (pkid: number) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `issue_material/bulk_update/${pkid}`,
      );
      return response.data;
    },
  });
};

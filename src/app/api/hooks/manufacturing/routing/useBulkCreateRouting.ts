import { useMutation } from '@tanstack/react-query';

import { RoutingProperty } from '@/helpers/utils/manufacturing/routing';
import AxiosService from '@/services/axiosService';

export const useBulkCreateRouting = () => {
  return useMutation({
    mutationKey: ['bulkCreateRouting'],
    mutationFn: async (data: RoutingProperty[]) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'routing/bulk',
        data,
      );
      return response.data;
    },
  });
};

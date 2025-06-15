import { useMutation } from '@tanstack/react-query';

import { FacilityProperty } from '@/helpers/utils/fixed_asset/facility';
import AxiosService from '@/services/axiosService';

interface Update {
  pkid: number;
  data: FacilityProperty;
}
export const useUpdateFacility = () => {
  return useMutation({
    mutationKey: ['updateFacilityByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `/facilities/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

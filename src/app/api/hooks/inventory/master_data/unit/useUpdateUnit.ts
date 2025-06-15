import { useMutation } from '@tanstack/react-query';

import { UnitProperty } from '@/helpers/utils/inventory/master_data/unit/unit';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: UnitProperty;
}
export const useUpdateUnit = () => {
  return useMutation({
    mutationKey: ['updateUnitByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceInventory.put(
        `unit/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

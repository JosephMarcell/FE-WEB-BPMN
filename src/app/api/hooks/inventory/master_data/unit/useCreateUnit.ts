import { useMutation } from '@tanstack/react-query';

import { UnitProperty } from '@/helpers/utils/inventory/master_data/unit/unit';
import AxiosService from '@/services/axiosService';

export const useCreateUnit = () => {
  return useMutation({
    mutationKey: ['createUnit'],
    mutationFn: async (data: UnitProperty) => {
      try {
        //console alert data to front end
        // alert(JSON.stringify(data));
        const response = await AxiosService.AxiosServiceInventory.post(
          'Unit/',
          data,
        );
        return response.data;
      } catch (error) {
        //console.error(error);
        // return error;
        throw new Error('Error creating Unit: ');
      }
    },
  });
};

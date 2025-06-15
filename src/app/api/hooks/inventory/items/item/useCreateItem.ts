import { useMutation } from '@tanstack/react-query';

import { ItemProperty } from '@/helpers/utils/inventory/item/item';
import AxiosService from '@/services/axiosService';

export const useCreateItem = () => {
  return useMutation({
    mutationKey: ['createItem'],
    mutationFn: async (data: ItemProperty) => {
      try {
        //console alert data to front end
        // alert(JSON.stringify(data));
        const response = await AxiosService.AxiosServiceInventory.post(
          'item/',
          data,
        );
        return response.data;
      } catch (error) {
        // console.error(error);
        // return error;
        throw new Error('Error creating Item: ');
      }
    },
  });
};

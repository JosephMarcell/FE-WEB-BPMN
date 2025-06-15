import { useMutation, useQuery } from '@tanstack/react-query';

import { ItemProperty } from '@/helpers/utils/inventory/inventory_item';
import AxiosService from '@/services/axiosService';

export const useGetAllItems = () => {
  return useQuery({
    queryKey: ['listItems'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get('items/');
      return data.data;
    },
  });
};

export const useGetAllBuyableItems = () => {
  return useQuery({
    queryKey: ['listBuyableItems'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'items/buyable/',
      );
      return data.data;
    },
  });
};

export const useGetAllSaleableItems = () => {
  return useQuery({
    queryKey: ['listSaleableItems'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'items/saleable/',
      );
      return data.data;
    },
  });
};

export const useCreateItem = () => {
  return useMutation({
    mutationKey: ['createItem'],
    mutationFn: async (data: ItemProperty) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'items/',
        data,
      );
      return response.data;
    },
  });
};

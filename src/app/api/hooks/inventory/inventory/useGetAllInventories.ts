import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllItemInventories = () => {
  return useQuery({
    queryKey: ['listItemInventories'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'inventory/all/',
      );
      return data.data;
    },
  });
};

export const useGetAllLocations = () => {
  return useQuery({
    queryKey: ['listLocations'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'inventory/',
      );
      return data.data;
    },
  });
};

export const useGetAllItemsPerInventory = (pkid_location: number) => {
  return useQuery({
    queryKey: ['listItemsPerInventory'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        `inventory/items/all/${pkid_location}/`,
      );
      return data.data;
    },
  });
};

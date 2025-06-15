import { useMutation, useQuery } from '@tanstack/react-query';

import { NewGeneralReceive } from '@/helpers/utils/inventory/inventory_receive';
import AxiosService from '@/services/axiosService';

export const useGetAllReceives = () => {
  return useQuery({
    queryKey: ['listReceives'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get('receive/');
      return data.data;
    },
  });
};

export const useGetAllRejectedReceives = () => {
  return useQuery({
    queryKey: ['listRejectedReceives'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'receive/rejected/',
      );
      return data.data;
    },
  });
};

export const useCreateReceiveBuy = () => {
  return useMutation({
    mutationKey: ['createReceiveBuy'],
    mutationFn: async (data: NewGeneralReceive) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'receive/',
        data,
      );
      return response.data;
    },
  });
};

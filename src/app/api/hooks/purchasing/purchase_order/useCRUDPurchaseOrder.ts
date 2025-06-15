import { useMutation, useQuery } from '@tanstack/react-query';

import { NewPurchasingProperty } from '@/helpers/utils/purchasing/purchasing';
import AxiosService from '@/services/axiosService';

export const useGetAllPurchaseOrders = () => {
  return useQuery({
    queryKey: ['listPurchaseOrder'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchases/ordered/',
      );
      return data;
    },
  });
};

export const useCreatePurchaseOrder = () => {
  return useMutation({
    mutationKey: ['createPurchaseOrder'],
    mutationFn: async (data: NewPurchasingProperty) => {
      const response = await AxiosService.AxiosServicePurchasing.post(
        'purchases/purchase_order',
        data,
      );
      return response.data;
    },
  });
};

export const useGetPurchaseOrderByCode = (code: string) => {
  return useQuery({
    queryKey: ['getPurchaseOrder', code],
    queryFn: async () => {
      if (!code) {
        return;
      }
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        `purchases/code/${code}`,
      );
      return data;
    },
    enabled: !!code,
  });
};

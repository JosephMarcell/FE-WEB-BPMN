import { useMutation, useQuery } from '@tanstack/react-query';

import {
  NewPurchasingProperty,
  PurchaseProperty,
} from '@/helpers/utils/purchasing/purchasing';
import AxiosService from '@/services/axiosService';

export const useGetAllPurchase = () => {
  return useQuery({
    queryKey: ['listPurchase'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchases/',
      );
      return data;
    },
  });
};

export const useGetAllPurchaseRequest = () => {
  return useQuery({
    queryKey: ['listPurchaseRequest'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServicePurchasing.get(
        'purchases/unordered/',
      );
      return data as PurchaseProperty[];
    },
  });
};

export const useCreatePurchaseRequest = () => {
  return useMutation({
    mutationKey: ['createPurchaseRequest'],
    mutationFn: async (data: NewPurchasingProperty) => {
      const response = await AxiosService.AxiosServicePurchasing.post(
        'purchases/',
        data,
      );
      return response.data;
    },
  });
};

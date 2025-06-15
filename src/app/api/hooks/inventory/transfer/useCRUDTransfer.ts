import { useMutation, useQuery } from '@tanstack/react-query';

import {
  NewGeneralTransfer,
  NewTransferSaleProps,
} from '@/helpers/utils/inventory/inventory_transfer';
import AxiosService from '@/services/axiosService';

export const useGetAllTransfers = () => {
  return useQuery({
    queryKey: ['listTransfers'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceInventory.get(
        'transfer/',
      );
      return data.data;
    },
  });
};

export const useCreateTransferSale = () => {
  return useMutation({
    mutationKey: ['createTransferSale'],
    mutationFn: async (data: NewTransferSaleProps) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'transfer/transfer-item-to-customer/',
        data,
      );
      return response.data;
    },
  });
};

export const useCreateGeneralTransfer = () => {
  return useMutation({
    mutationKey: ['createGeneralTransfer'],
    mutationFn: async (data: NewGeneralTransfer) => {
      const response = await AxiosService.AxiosServiceInventory.post(
        'transfer/transfer-item-general',
        data,
      );
      return response.data;
    },
  });
};

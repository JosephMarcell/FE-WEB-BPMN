import { useMutation } from '@tanstack/react-query';

import { TransferMaterialProperty } from '@/helpers/utils/manufacturing/transfer_material';
import AxiosService from '@/services/axiosService';

export const useCreateTransferMaterial = () => {
  return useMutation({
    mutationKey: ['createTransferMaterial'],
    mutationFn: async (data: TransferMaterialProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'transfer_material/',
        data,
      );
      return response.data;
    },
  });
};

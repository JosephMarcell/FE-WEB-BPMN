import { useMutation } from '@tanstack/react-query';

import {
  InputOverheadManufactureProperty,
  OverheadManufactureProperty,
} from '@/helpers/utils/general_ledger/overheadManufacture';
import AxiosService from '@/services/axiosService';

export const useGetAllMachineOverhead = () => {
  return useMutation({
    mutationKey: ['listMachineOverhead'],
    mutationFn: async (data: InputOverheadManufactureProperty) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'accountCalculation/overheadManufactureWithTax',
        data,
      );
      if (response.data.data) {
        response.data.data = response.data.data.map(
          (item: OverheadManufactureProperty) => {
            return {
              ...item,
              percentage: 100,
              result_price: (item.price * 100) / 100,
            };
          },
        );
      }
      return response.data.data;
    },
  });
};

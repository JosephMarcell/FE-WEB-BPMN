import { useMutation } from '@tanstack/react-query';

import { CurrencyProperty } from '@/helpers/utils/cash_bank/currency';
import AxiosService from '@/services/axiosService';

export const useCreateCurrency = () => {
  return useMutation({
    mutationKey: ['createCurrency'],
    mutationFn: async (data: CurrencyProperty) => {
      const response = await AxiosService.AxiosServiceGeneralSystem.post(
        'currency/',
        data,
      );
      return response.data;
    },
  });
};

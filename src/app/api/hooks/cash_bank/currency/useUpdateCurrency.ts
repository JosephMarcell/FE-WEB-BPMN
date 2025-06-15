import { useMutation } from '@tanstack/react-query';

import { CurrencyProperty } from '@/helpers/utils/cash_bank/currency';
import AxiosService from '@/services/axiosService';

export const useUpdateCurrency = () => {
  return useMutation({
    mutationKey: ['updateCurrency'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<CurrencyProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceGeneralSystem.put(
        `currency/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

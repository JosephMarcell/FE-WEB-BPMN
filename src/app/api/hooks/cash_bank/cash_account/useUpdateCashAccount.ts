import { useMutation } from '@tanstack/react-query';

import { CashAccountProperty } from '@/helpers/utils/cash_bank/cash_account';
import AxiosService from '@/services/axiosService';

export const useUpdateCashAccount = () => {
  return useMutation({
    mutationKey: ['updateCashAccount'],
    mutationFn: async ({
      data,
      pkid,
    }: {
      data: Partial<CashAccountProperty>;
      pkid: number;
    }) => {
      const response = await AxiosService.AxiosServiceCashBank.put(
        `cashAccount/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteSalesDownPaymentInvoice = () => {
  return useMutation({
    mutationKey: ['hardDeleteSalesDownPaymentInvoice'],
    mutationFn: async (pkid: number) => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.delete(
        `salesDownPaymentInvoice/hard/${pkid}`,
      );
      return data;
    },
  });
};

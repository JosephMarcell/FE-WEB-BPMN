import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeletePurchaseDownPaymentInvoice = () => {
  return useMutation({
    mutationKey: ['hardDeletePurchaseDownPaymentInvoice'],
    mutationFn: async (pkid: number) => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.delete(
        `purchaseDownPaymentInvoice/hard/${pkid}`,
      );
      return data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeletePurchaseInvoice = () => {
  return useMutation({
    mutationKey: ['hardDeletePurchaseInvoice'],
    mutationFn: async (pkid: number) => {
      const { data } = await AxiosService.AxiosServiceAccountPayable.delete(
        `purchaseInvoice/hard/${pkid}`,
      );
      return data;
    },
  });
};

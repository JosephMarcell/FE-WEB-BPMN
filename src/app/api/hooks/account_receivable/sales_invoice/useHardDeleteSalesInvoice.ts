import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useHardDeleteSalesInvoice = () => {
  return useMutation({
    mutationKey: ['hardDeleteSalesInvoice'],
    mutationFn: async (pkid: number) => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.delete(
        `salesInvoice/hard/${pkid}`,
      );
      return data;
    },
  });
};

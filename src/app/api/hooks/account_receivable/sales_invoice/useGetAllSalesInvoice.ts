import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllSalesInvoice = () => {
  return useQuery({
    queryKey: ['listSalesInvoice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceAccountReceivable.get(
        'salesInvoice/',
      );
      return data.data;
    },
  });
};

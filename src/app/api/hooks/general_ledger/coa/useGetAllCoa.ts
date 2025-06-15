import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllCoa = () => {
  return useQuery({
    queryKey: ['listCoa'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get('coa/');
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllAccountType = () => {
  return useQuery({
    queryKey: ['listAccountType'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceGeneralLedger.get(
        'accountType/',
      );
      return data.data;
    },
  });
};

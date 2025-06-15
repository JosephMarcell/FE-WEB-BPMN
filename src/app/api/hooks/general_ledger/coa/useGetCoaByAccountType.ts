import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCoaByAccountType = () => {
  return useMutation({
    mutationKey: ['getCoaByAccountType'],
    mutationFn: async (accountTypePkid: number) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.get(
        `coa/accounttype/${accountTypePkid}`,
      );
      return response.data;
    },
  });
};

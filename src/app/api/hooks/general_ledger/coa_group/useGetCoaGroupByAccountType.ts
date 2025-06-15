import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetCoaGroupByAccountType = () => {
  return useMutation({
    mutationKey: ['getCoaGroupByAccountType'],
    mutationFn: async (accountTypePkid: number) => {
      const response = await AxiosService.AxiosServiceGeneralLedger.get(
        `coaGroup/accounttype/${accountTypePkid}`,
      );
      return response.data;
    },
  });
};

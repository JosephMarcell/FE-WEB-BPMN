import { useMutation } from '@tanstack/react-query';

import { InsuranceProperty } from '@/helpers/utils/hrm/insurance';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: InsuranceProperty;
}
export const useUpdateInsurance = () => {
  return useMutation({
    mutationKey: ['updateInsuranceByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `asuransi/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { SKPTProperty } from '@/helpers/utils/hrm/tax_variables/skpt';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: SKPTProperty;
}
export const useUpdateSKPT = () => {
  return useMutation({
    mutationKey: ['updateSKPTByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.put(
          `ptkp/${pkid}`,
          data,
        );
        return response.data;
      } catch (error) {
        // Handle the error here
        // throw error;
      }
    },
  });
};

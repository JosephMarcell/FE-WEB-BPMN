import { useMutation } from '@tanstack/react-query';

import { FiscalTypeProperty } from '@/helpers/utils/fixed_asset/fiscal_type';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: FiscalTypeProperty;
}
export const useUpdateFiscalType = () => {
  return useMutation({
    mutationKey: ['updateFiscalTypeByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceFixedAsset.put(
        `fiscal_type/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

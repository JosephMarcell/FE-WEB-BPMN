import { useMutation } from '@tanstack/react-query';

import {
  GetCoaByCoaGroupInput,
  GetCoaByCoaGroupResponse,
} from '@/helpers/utils/general_ledger/coa';
import AxiosService from '@/services/axiosService';

export const useGetCoaByCoaGroup = () => {
  return useMutation({
    mutationKey: ['getCoaByCoaGroup'],
    mutationFn: async (
      input: GetCoaByCoaGroupInput,
    ): Promise<GetCoaByCoaGroupResponse> => {
      const response = await AxiosService.AxiosServiceGeneralLedger.post(
        'coa/findByCoaGroupIDs',
        input,
      );
      return response.data;
    },
  });
};

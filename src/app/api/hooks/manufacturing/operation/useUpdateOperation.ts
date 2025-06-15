import { useMutation } from '@tanstack/react-query';

import { OperationProperty } from '@/helpers/utils/manufacturing/operation';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: OperationProperty;
}
export const useUpdateOperation = () => {
  return useMutation({
    mutationKey: ['updateOperation'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `operation/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

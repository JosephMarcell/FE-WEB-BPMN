import { useMutation } from '@tanstack/react-query';

import { MachineProperty } from '@/helpers/utils/manufacturing/machine';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: number;
  data: MachineProperty;
}
export const useUpdateMachineByPkid = () => {
  return useMutation({
    mutationKey: ['updateMachineByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceManufacturing.put(
        `machine/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { MachineProperty } from '@/helpers/utils/manufacturing/machine';
import AxiosService from '@/services/axiosService';

export const useCreateMachine = () => {
  return useMutation({
    mutationKey: ['createMan'],
    mutationFn: async (data: MachineProperty) => {
      const response = await AxiosService.AxiosServiceManufacturing.post(
        'machine/',
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { OvertimeProperty } from '@/helpers/utils/hrm/overtime';
import AxiosService from '@/services/axiosService';

export const useCreateOvertime = () => {
  return useMutation({
    mutationKey: ['createOvertime'],
    mutationFn: async (data: OvertimeProperty) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'overtime/',
          data,
        );
        return response.data;
      } catch (error) {
        throw new Error('Error creating Overtime: ' + error);
      }
    },
  });
};

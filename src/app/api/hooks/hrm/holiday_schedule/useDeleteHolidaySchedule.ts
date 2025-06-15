import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useDeleteHolidaySchedule = () => {
  return useMutation({
    mutationKey: ['deleteHolidaySchedule'],
    mutationFn: async (pkid: number) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.delete(
          `day_off/${pkid}/`,
        );
        return response.data;
      } catch (error) {
        // Console log error
        throw new Error('Error deleting holiday schedule: ');
      }
    },
  });
};

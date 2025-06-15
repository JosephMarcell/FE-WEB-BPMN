import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

// Define a type for creating a holiday schedule
export interface CreateHolidayScheduleProperty {
  date: string;
}

export const useCreateHolidaySchedule = () => {
  return useMutation({
    mutationKey: ['createHolidaySchedule'],
    mutationFn: async (data: CreateHolidayScheduleProperty) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'day_off/',
          data,
        );
        return response.data;
      } catch (error) {
        // Console log error
        throw new Error('Error creating holiday schedule: ');
      }
    },
  });
};

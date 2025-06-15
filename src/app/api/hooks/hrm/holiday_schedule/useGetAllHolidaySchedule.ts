import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllHolidaySchedule = () => {
  return useQuery({
    queryKey: ['listHolidaySchedule'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'day_off/',
      );
      return { data: data.data, headers };
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import { ScheduleProperty } from '@/helpers/utils/scheduling/schedule';
import AxiosService from '@/services/axiosService';

export const useGetAllSchedule = () => {
  return useQuery({
    queryKey: ['listSchedule'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceScheduling.get(
        'scheduling/',
      );

      data.data = data.data.map((item: ScheduleProperty) => {
        return {
          ...item,
          start: item.start_date,
          end: item.end_date,
          id: item.job_order_detail_pkid,
          title: item.operation_name,
          className: 'bg-danger',
          color: item.color,
        };
      });
      return data.data;
    },
  });
};

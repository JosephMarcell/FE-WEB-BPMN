import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface FilterParams {
  actual_date?: string;
  start_date?: string;
  end_date?: string;
  action_type?: string[];
  username?: string[];
}

interface ActivityLog {
  pkid: number;
  actor_username: string;
  actor_role: string;
  action_type: string;
  action_time: string;
  office: string;
}

interface ActivityLogResponse {
  data: ActivityLog[];
}

export const useGetFilterActivityLog = (
  filters: FilterParams = {},
  enabled = true,
) => {
  return useQuery<ActivityLogResponse>({
    queryKey: ['activityLog', filters],
    queryFn: async () => {
      const { actual_date, start_date, end_date, action_type, username } =
        filters;

      // Convert filter parameters to query string format
      const queryParams = new URLSearchParams();
      if (actual_date) queryParams.append('actual_date', actual_date);
      if (start_date) queryParams.append('start_date', start_date);
      if (end_date) queryParams.append('end_date', end_date);
      if (action_type)
        action_type.forEach(type => queryParams.append('action_type', type));
      if (username)
        username.forEach(user => queryParams.append('username', user));

      const { data } = await AxiosService.AxiosServiceUserManagement.get(
        `/log/get-log-activity?${queryParams.toString()}`,
      );

      return data.data as ActivityLogResponse;
    },
    enabled,
  });
};

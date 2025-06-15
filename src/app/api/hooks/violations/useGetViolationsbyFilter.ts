import { useQuery } from '@tanstack/react-query';

import { getAllViolationsProps } from '@/helpers/utils/violations/violation';
import AxiosService from '@/services/axiosService';

interface FilterParams {
  status?: string[];
  severity?: string[];
  page?: number;
  per_page?: number;
  start_date?: string; // Add start_date
  end_date?: string; // Add end_date
}

interface AssetPaginationResponse {
  page: number;
  per_page: number;
  max_page: number;
  count: number;
}

interface ViolationFilterResponse {
  data: getAllViolationsProps[];
  pagination: AssetPaginationResponse;
}

export const useGetViolationsbyFilter = (
  filters: FilterParams = { page: 1, per_page: 10 }, // Default to page 1, per_page 10
  enabled = true,
) => {
  return useQuery<ViolationFilterResponse>({
    queryKey: ['violations', filters],
    queryFn: async () => {
      const {
        status = [],
        severity = [],
        page = 1,
        per_page = 10,
        start_date,
        end_date,
      } = filters;

      // Convert filter parameters to query string format
      const queryParams = new URLSearchParams();
      status.forEach(st => queryParams.append('status', st));
      severity.forEach(svr => queryParams.append('severity', svr));
      queryParams.append('page', String(page)); // Add the page parameter
      queryParams.append('per_page', String(per_page)); // Add the per_page parameter
      if (start_date) queryParams.append('start_date', start_date); // Add start_date if present
      if (end_date) queryParams.append('end_date', end_date); // Add end_date if present

      const url = `/violations/filter?${queryParams.toString()}`;
      const { data } = await AxiosService.AxiosServiceViolations.get(url);

      // Ensure the response structure matches ViolationFilterResponse
      return {
        data: data.data,
        pagination: {
          page: data.page,
          per_page: data.per_page,
          max_page: data.max_page,
          count: data.count,
        },
      };
    },
    enabled,
  });
};

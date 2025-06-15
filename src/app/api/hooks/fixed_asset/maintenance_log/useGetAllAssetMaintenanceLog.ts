import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

type MaintenanceLog = {
  id: number;
  description: string;
  date: string;
};

interface FilterParams {
  page?: number;
  per_page?: number;
}

interface MaintenancePaginationResponse {
  data: MaintenanceLog[]; // Array of maintenance logs
  pagination: {
    page: number; // Current page number
    per_page: number; // Items per page
    max_page: number; // Total number of pages
    count: number; // Total number of maintenance logs
  };
}

export const useGetAllAssetMaintenance = (
  filters: FilterParams = { page: 1, per_page: 10 }, // Default to page 1, per_page 10
  enabled = true,
) => {
  return useQuery<MaintenancePaginationResponse>({
    queryKey: ['asset-maintenance', filters],
    queryFn: async () => {
      const { page = 1, per_page = 10 } = filters;

      // Convert filter parameters to query string format
      const queryParams = new URLSearchParams();
      queryParams.append('page', String(page)); // Add the page parameter
      queryParams.append('per_page', String(per_page)); // Add the per_page parameter

      const url = `/assets/maintenance-log?${queryParams.toString()}`;
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(url);

      // Ensure the response structure matches MaintenancePaginationResponse
      return {
        data: data.data.data,
        pagination: {
          page: data.data.page,
          per_page: data.data.per_page,
          max_page: data.data.max_page,
          count: data.data.count,
        },
      };
    },
    enabled,
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

type MaintenanceLog = {
  id: number;
  description: string;
  date: string;
};

interface MaintenancePaginationResponse {
  data: MaintenanceLog[]; // Array of maintenance logs
  pagination: {
    page: number; // Current page number
    per_page: number; // Items per page
    max_page: number; // Total number of pages
    count: number; // Total number of maintenance logs
  };
}

export const useGetAllAssetMaintenanceEach = (
  model_pkid: number,
  page: number,
  perPage: number,
) => {
  return useQuery<MaintenancePaginationResponse>({
    queryKey: ['assetMaintenanceEach', model_pkid, page, perPage],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `assets/${model_pkid}/maintenance-log?page=${page}&per_page=${perPage}`,
      );
      // Return the full response with data and pagination info
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
  });
};

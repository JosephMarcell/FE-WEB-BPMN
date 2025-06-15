import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

type Resource = {
  pkid: number; // Unique identifier for the resource
  asset_code: string; // Unique code for the resource
  resource_name: string; // Name of the resource
  office_name: string; // Name of the office/location
  description: string; // Description of the resource
};

interface ResourcePaginationResponse {
  data: Resource[]; // Array of resources for the current page
  pagination: {
    page: number; // Current page number
    per_page: number; // Items per page
    max_page: number; // Total number of pages
    count: number; // Total number of resources
  };
}

export const useGetAllResource = (page: number, perPage: number) => {
  return useQuery<ResourcePaginationResponse>({
    queryKey: ['listResource', page, perPage],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `/resources?page=${page}&per_page=${perPage}`,
      );

      // Ensure the response structure matches ResourcePaginationResponse
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

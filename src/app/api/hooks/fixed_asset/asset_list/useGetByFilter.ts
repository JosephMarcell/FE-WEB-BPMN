import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

type Asset = {
  pkid: number; // Unique identifier for the asset
  asset_code: string; // Unique code for the asset
  asset_type: string; // Define possible asset types
  purchase_date: Date; // Purchase date in string format
  condition: string; // Condition of the asset
  status: string; // Status of the asset
  last_usage: string; // Last usage date in string format
  description: string; // Description of the asset
  office_pkid: number; // Reference to an office/location
};

interface FilterParams {
  status?: string[];
  condition?: string[];
  asset_type?: string[];
  page?: number;
  per_page?: number;
}

interface AssetPaginationResponse {
  data: Asset[]; // Array of assets for the current page
  pagination: {
    page: number; // Current page number
    per_page: number; // Items per page
    max_page: number; // Total number of pages
    count: number; // Total number of assets
  };
}

export const useGetAssetByFilter = (
  filters: FilterParams = { page: 1, per_page: 10 }, // Default to page 1, per_page 10
  enabled = true,
) => {
  return useQuery<AssetPaginationResponse>({
    queryKey: ['assets', filters],
    queryFn: async () => {
      const {
        status = [],
        condition = [],
        asset_type = [],
        page = 1,
        per_page = 10,
      } = filters;

      // Convert filter parameters to query string format
      const queryParams = new URLSearchParams();
      status.forEach(st => queryParams.append('status', st));
      condition.forEach(cnd => queryParams.append('condition', cnd));
      asset_type.forEach(at => queryParams.append('asset_type', at));
      queryParams.append('page', String(page)); // Add the page parameter
      queryParams.append('per_page', String(per_page)); // Add the per_page parameter

      const url = `/assets/filter?${queryParams.toString()}`;
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(url);

      // Ensure the response structure matches AssetPaginationResponse
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

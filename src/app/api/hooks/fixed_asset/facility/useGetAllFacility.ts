import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

type Facility = {
  pkid: number; // Unique identifier for the facility
  facility_name: string; // Name of the facility
  last_usage: string; // Last usage date in string format
  condition: string; // Condition of the facility
  status: string; // Status of the facility
  description: string; // Description of the facility
  office_name: string; // Name of the office/location
};

interface FacilityPaginationResponse {
  data: Facility[]; // Array of facilities for the current page
  pagination: {
    page: number; // Current page number
    per_page: number; // Items per page
    max_page: number; // Total number of pages
    count: number; // Total number of facilities
  };
}

export const useGetAllFacility = (page: number, perPage: number) => {
  return useQuery<FacilityPaginationResponse>({
    queryKey: ['listFacility', page, perPage],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceFixedAsset.get(
        `/facilities?page=${page}&per_page=${perPage}`,
      );

      // Ensure the response structure matches FacilityPaginationResponse
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

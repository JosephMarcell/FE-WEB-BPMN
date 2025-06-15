import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface FacilityCreateData {
  facility_name: string | null;
  facility_lat: number | null;
  facility_long: number | null;
  condition: string | null;
  status: string | null;
  description: string | null;
}

export const useCreateFacility = () => {
  return useMutation({
    mutationKey: ['createFacility'],
    mutationFn: async (data: FacilityCreateData) => {
      const response = await AxiosService.AxiosServiceFixedAsset.post(
        '/facilities',
        data,
      );
      return response.data;
    },
  });
};

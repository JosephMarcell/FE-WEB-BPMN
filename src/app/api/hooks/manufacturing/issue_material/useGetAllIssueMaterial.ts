import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllIssueMaterial = () => {
  return useQuery({
    queryKey: ['listIssueMaterial'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceManufacturing.get(
        'issue_material/',
      );
      return data.data;
    },
  });
};

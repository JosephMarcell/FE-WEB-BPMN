import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useOfficeByToken = () => {
  return useQuery({
    queryKey: ['dataOffice'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceUserManagement.get(
        '/office/office-information',
      );
      return data.data;
    },
  });
};

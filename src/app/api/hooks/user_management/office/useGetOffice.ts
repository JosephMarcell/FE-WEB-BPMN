import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetOffice = () => {
  return useQuery({
    queryKey: ['office'],
    queryFn: async () => {
      const url = '/office/office-information';
      const { data } = await AxiosService.AxiosServiceUserManagement.get(url);
      return data.data.data;
    },
  });
};

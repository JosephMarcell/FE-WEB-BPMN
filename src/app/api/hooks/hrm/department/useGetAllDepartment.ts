import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllDepartment = () => {
  return useQuery({
    queryKey: ['listDepartment'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'department/',
      );
      return { data: data.data, headers };
    },
  });
};

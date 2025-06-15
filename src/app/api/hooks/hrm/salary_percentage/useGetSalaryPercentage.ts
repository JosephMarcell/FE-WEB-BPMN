import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetSalaryPercentage = () => {
  return useQuery({
    queryKey: ['listSalaryPercentage'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'salary_percentage/',
      );
      return { data: data.data, headers };
    },
  });
};

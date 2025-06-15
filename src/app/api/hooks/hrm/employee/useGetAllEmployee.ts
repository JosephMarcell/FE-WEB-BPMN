import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllEmployee = () => {
  return useQuery({
    queryKey: ['listEmployee'],
    queryFn: async () => {
      const response = await AxiosService.AxiosServiceHRM.get('employee/');
      return {
        data: response.data.data,
        headers: response.headers,
      };
    },
  });
};

export const useGetAllEmployeeWhite = () => {
  return useQuery({
    queryKey: ['listEmployeeWhite'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'employee/white',
      );
      return { data: data.data, headers };
    },
  });
};

export const useGetAllEmployeeBlue = () => {
  return useQuery({
    queryKey: ['listEmployeeBlue'],
    queryFn: async () => {
      const { data, headers } = await AxiosService.AxiosServiceHRM.get(
        'employee/blue',
      );
      return { data: data.data, headers };
    },
  });
};

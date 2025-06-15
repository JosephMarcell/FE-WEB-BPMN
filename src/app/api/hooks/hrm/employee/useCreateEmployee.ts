import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useCreateEmployee = () => {
  return useMutation({
    mutationKey: ['createEmployee'],
    mutationFn: async (data: {
      email: string;
      fullname: string;
      position_id: string;
      user_id: number;
      req_id: number;
      gender: string;
      join_date: string;
      ptkp_id: number;
      updated_ptkp_issue: string;
    }) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'employee/',
          data,
        );
        return response.data;
      } catch (error) {
        // Console log error
        throw new Error('Error creating employee: ');
      }
    },
  });
};

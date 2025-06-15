import { useMutation } from '@tanstack/react-query';

import { CharityProperty } from '@/helpers/utils/hrm/charity';
import AxiosService from '@/services/axiosService';

export const useCreateCharity = () => {
  return useMutation({
    mutationKey: ['createCharity'],
    mutationFn: async (data: CharityProperty) => {
      try {
        //console alert data to front end
        alert(JSON.stringify(data));
        const response = await AxiosService.AxiosServiceHRM.post('amal/', data);
        return response.data;
      } catch (error) {
        //console.error(error);
        // return error;
        throw new Error('Error creating Charity: ');
      }
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface Delete {
  data: number[];
}

export const useDeleteFamilyMember = () => {
  return useMutation({
    mutationKey: ['deleteFamilyMember'],
    mutationFn: async ({ data }: Delete) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.delete(
          'family_member/',
          {
            data: data,
          },
        );
        return response.data;
      } catch (error) {
        // Console log error
        throw new Error('Error creating employee: ');
      }
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface FamilyMemberCreate {
  employee_id: number | null;
  name: string;
  role: string;
}

export const useCreateFamilyMember = () => {
  return useMutation({
    mutationKey: ['createFamilyMember'],
    mutationFn: async (data: FamilyMemberCreate) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.post(
          'family_member/',
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

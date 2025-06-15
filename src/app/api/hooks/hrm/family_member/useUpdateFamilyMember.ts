import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface FamilyMemberUpdate {
  employee_id: number | null;
  name: string;
  role: string;
}

interface Update {
  pkid: string | number;
  data: FamilyMemberUpdate;
}

export const useUpdateFamilyMember = () => {
  return useMutation({
    mutationKey: ['updateFamilyMember'],
    mutationFn: async ({ pkid, data }: Update) => {
      try {
        const response = await AxiosService.AxiosServiceHRM.put(
          'family_member/' + pkid + '/',
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

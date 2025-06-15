import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface UpdateContactData {
  contactEmail: string;
  contactPhone: string;
}

export const useUpdateTenantContact = () => {
  return useMutation({
    mutationKey: ['updateTenantContact'],
    mutationFn: async (data: UpdateContactData) => {
      console.log('Sending contact update with data:', data);

      // Make sure to use PATCH method instead of PUT
      const response = await AxiosService.AxiosServiceUserManagement.patch(
        '/api/admin/tenants/contact',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      console.log('Contact update response:', response.data);
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useUpdateTenantLogo = () => {
  return useMutation({
    mutationKey: ['updateTenantLogo'],
    mutationFn: async (file: File) => {
      console.log('Uploading logo file:', file.name, 'Size:', file.size);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('tenant_logo', file);

      // Make sure to use PATCH method instead of PUT
      const response = await AxiosService.AxiosServiceUserManagement.patch(
        '/api/admin/tenants/logo',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Logo update response:', response.data);
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

interface CreateTenantData {
  name: string;
  description: string;
  logo_url: string;
  contact_email: string;
  contact_phone: string;
  max_users: number;
  subscription_plan: string;
  subscription_start_date: string;
  subscription_end_date: string;
  is_active: boolean;
}

export const useCreateTenant = () => {
  return useMutation({
    mutationFn: async (data: CreateTenantData) => {
      const response = await AxiosService.AxiosServiceUserManagement.post(
        '/api/tenants',
        data,
      );
      return response.data;
    },
  });
};

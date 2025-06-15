import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

// Interface sesuai struktur API baru
export interface UserDetail {
  id: string;
  username: string;
  full_name?: string;
  email: string;
  alamat?: string;
  is_verified: boolean;
  role: string;
  latitude?: number;
  longitude?: number;
}

export const useGetUserDetail = (userId: string) => {
  const userRole = Cookies.get('userRole');
  console.log('useGetUserDetail userId:', userId, 'userRole:', userRole);

  return useQuery<UserDetail>({
    queryKey: ['userDetail', userId],
    queryFn: async () => {
      if (!userId || userId === 'undefined') {
        throw new Error('Invalid user ID');
      }

      try {
        let response;

        // Use different endpoints based on user role
        if (userRole === 'SUPERADMIN') {
          // SUPERADMIN can access any user
          console.log('Fetching user as SUPERADMIN');
          response = await AxiosService.AxiosServiceUserManagement.get(
            `/api/admin/users/${userId}`,
          );
        } else if (userRole === 'ADMIN') {
          // ADMIN can only access users in their tenant
          console.log('Fetching user as ADMIN');
          response = await AxiosService.AxiosServiceUserManagement.get(
            `/api/admin/tenants/users/${userId}`,
          );
        } else {
          throw new Error(
            'Unauthorized: You do not have permission to view user details',
          );
        }

        const data = response.data.data;
        return {
          ...data,
        };
      } catch (error) {
        console.error('Error fetching user details:', error);

        // Provide more specific error messages
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 403) {
            throw new Error('You do not have permission to view this user');
          } else if (error.response?.status === 404) {
            throw new Error('User not found');
          }
        }

        throw error;
      }
    },
    enabled: !!userId && userId !== 'undefined',
    retry: false, // Don't retry on authentication failures
  });
};

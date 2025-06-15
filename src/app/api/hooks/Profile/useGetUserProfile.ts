import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';

import AxiosService from '@/services/axiosService';

export interface UserData {
  id: string;
  username: string;
  email: string;
  role: string;
  is_verified: boolean;
  full_name?: string;
  alamat?: string;
  latitude?: number;
  longitude?: number;
  profile_image_url?: string; // For avatar
  status?: string;
}

export const useGetUserProfile = () => {
  return useQuery<UserData, Error>({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceUserManagement.get(
        '/api/users/profile', // Pastikan endpoint ini sesuai dengan API baru
      );

      const currentRole = Cookies.get('userRole');
      if (currentRole !== data.data.role) {
        Cookies.set('userRole', data.data.role);
        window.location.reload(); // Refresh the page
      }
      return data.data;
    },
  });
};

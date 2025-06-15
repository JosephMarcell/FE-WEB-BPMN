import AxiosService from '@/services/axiosService';

export const updateUserData = async (data: {
  username?: string;
  full_name?: string;
  email?: string;
  alamat?: string;
  latitude?: number;
  longitude?: number;
}) => {
  const response = await AxiosService.AxiosServiceUserManagement.put(
    '/user/user-update',
    data,
  );
  return response.data;
};

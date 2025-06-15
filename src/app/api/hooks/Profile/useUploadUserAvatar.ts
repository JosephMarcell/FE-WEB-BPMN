import AxiosService from '@/services/axiosService';

export const uploadUserAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await AxiosService.AxiosServiceUserManagement.patch(
    '/user/upload-avatar',
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    },
  );

  return response.data;
};

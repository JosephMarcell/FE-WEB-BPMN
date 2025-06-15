import AxiosService from '@/services/axiosService';
export const useCreateMediaViolation = async (files: File[], pkid: number) => {
  for (const file of files) {
    const formData = new FormData();
    const fileType = file.type;
    if (!['image/png', 'image/jpeg', 'image/jpg'].includes(fileType)) {
      console.warn(
        `Invalid file type: ${fileType}. Only PNG and JPEG are allowed. Skipping file.`,
      );
      continue;
    }

    formData.append('media', file);
    formData.append('media_type', fileType);
    const url = `/violations/${pkid}/media`;
    await AxiosService.AxiosServiceViolations.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }
};

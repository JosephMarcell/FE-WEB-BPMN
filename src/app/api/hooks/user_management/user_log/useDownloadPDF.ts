import AxiosService from '@/services/axiosService';

export const useDownloadActivityLogPDF = () => {
  const downloadPDF = async () => {
    const response = await AxiosService.AxiosServiceUserManagement.get(
      '/log/export-log-activity-pdf',
      { responseType: 'blob' },
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'activity_log.pdf');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return { downloadPDF };
};

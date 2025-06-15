import AxiosService from '@/services/axiosService';

export const useDownloadActivityLogCSV = () => {
  const downloadCSV = async () => {
    const response = await AxiosService.AxiosServiceUserManagement.get(
      '/log/export-log-activity-csv',
      { responseType: 'blob' },
    );
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'activity_log.csv');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return { downloadCSV };
};

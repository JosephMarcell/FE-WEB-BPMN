import AxiosService from '@/services/axiosService';

export const useGenerateCSVSalesInvoice = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceAccountReceivable.defaults.baseURL}salesInvoice/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

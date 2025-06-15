import AxiosService from '@/services/axiosService';

export const useGenerateCSVSalesDownPaymentInvoice = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceAccountReceivable.defaults.baseURL}salesDownPaymentInvoice/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

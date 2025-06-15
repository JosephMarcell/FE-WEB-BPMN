import AxiosService from '@/services/axiosService';

export const useGenerateCSVPurchaseDownPaymentInvoice = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceAccountPayable.defaults.baseURL}purchaseDownPaymentInvoice/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

import AxiosService from '@/services/axiosService';

export const useGenerateCSVPurchaseInvoice = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceAccountPayable.defaults.baseURL}purchaseInvoice/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

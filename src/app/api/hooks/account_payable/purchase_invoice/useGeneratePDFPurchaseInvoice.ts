import AxiosService from '@/services/axiosService';

export const useGeneratePDFPurchaseInvoice = () => {
  const generatePDF = (pkid: number) => {
    const url = `${AxiosService.AxiosServiceAccountPayable.defaults.baseURL}purchaseInvoice/generatePdf/${pkid}`;
    window.open(url, '_blank');
  };

  return { generatePDF };
};

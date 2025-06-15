import AxiosService from '@/services/axiosService';

export const useGeneratePDFPurchaseDownPaymentInvoice = () => {
  const generatePDF = (pkid: number) => {
    const url = `${AxiosService.AxiosServiceAccountPayable.defaults.baseURL}purchaseDownPaymentInvoice/generatePdf/${pkid}`;
    window.open(url, '_blank');
  };

  return { generatePDF };
};

import AxiosService from '@/services/axiosService';

export const useGeneratePDFSalesDownPaymentInvoice = () => {
  const generatePDF = (pkid: number) => {
    const url = `${AxiosService.AxiosServiceAccountReceivable.defaults.baseURL}salesDownPaymentInvoice/generatePdf/${pkid}`;
    window.open(url, '_blank');
  };

  return { generatePDF };
};

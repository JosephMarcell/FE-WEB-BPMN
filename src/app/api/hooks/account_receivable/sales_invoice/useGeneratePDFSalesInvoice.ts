import AxiosService from '@/services/axiosService';

export const useGeneratePDFSalesInvoice = () => {
  const generatePDF = (pkid: number) => {
    const url = `${AxiosService.AxiosServiceAccountReceivable.defaults.baseURL}salesInvoice/generatePdf/${pkid}`;
    window.open(url, '_blank');
  };

  return { generatePDF };
};

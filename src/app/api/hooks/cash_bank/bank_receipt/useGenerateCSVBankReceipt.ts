import AxiosService from '@/services/axiosService';

export const useGenerateCSVBankReceipt = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceCashBank.defaults.baseURL}bankReceipt/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

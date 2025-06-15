import AxiosService from '@/services/axiosService';

export const useGenerateCSVCashReceipt = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceCashBank.defaults.baseURL}cashReceipt/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

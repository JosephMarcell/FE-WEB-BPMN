import AxiosService from '@/services/axiosService';

export const useGenerateCSVBankDisbursement = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceCashBank.defaults.baseURL}bankDisbursement/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

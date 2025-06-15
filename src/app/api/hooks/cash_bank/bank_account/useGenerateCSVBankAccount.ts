import AxiosService from '@/services/axiosService';

export const useGenerateCSVBankAccount = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceCashBank.defaults.baseURL}bankAccount/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

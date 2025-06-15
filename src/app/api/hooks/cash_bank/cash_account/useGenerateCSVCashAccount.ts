import AxiosService from '@/services/axiosService';

export const useGenerateCSVCashAccount = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceCashBank.defaults.baseURL}cashAccount/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

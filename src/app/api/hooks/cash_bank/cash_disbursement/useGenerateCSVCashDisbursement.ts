import AxiosService from '@/services/axiosService';

export const useGenerateCSVCashDisbursement = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceCashBank.defaults.baseURL}cashDisbursement/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

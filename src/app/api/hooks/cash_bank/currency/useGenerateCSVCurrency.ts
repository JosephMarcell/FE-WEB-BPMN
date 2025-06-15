import AxiosService from '@/services/axiosService';

export const useGenerateCSVCurrency = () => {
  const generateCSV = () => {
    const url = `${AxiosService.AxiosServiceGeneralSystem.defaults.baseURL}currency/generateCsv/`;
    window.open(url, '_blank');
  };

  return { generateCSV };
};

import { useMutation } from '@tanstack/react-query';

import { PredictProperty } from '@/helpers/utils/scheduling/predict';
import AxiosService from '@/services/axiosService';

export const useGetPredictProduction = () => {
  return useMutation({
    mutationKey: ['getPredictProduction'],
    mutationFn: async (data: PredictProperty) => {
      const response = await AxiosService.AxiosServiceScheduling.post(
        'scheduling/predict',
        data,
      );

      return response.data.data;
    },
  });
};

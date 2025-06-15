import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllBlueCollarWitholdCertificate = () => {
  return useQuery({
    queryKey: ['listBlueCollarWitholdCertificate'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get('bukpot_blue/');
      return data.data;
    },
  });
};

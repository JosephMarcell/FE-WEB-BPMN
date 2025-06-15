import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetAllWhiteCollarWitholdCertificate = () => {
  return useQuery({
    queryKey: ['listWhiteCollarWitholdCertificate'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get('bukpot/');
      return data.data;
    },
  });
};

import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetPPHByPkid = (pkid: string | number) => {
  return useQuery({
    queryKey: [pkid],
    queryFn: async () => {
      const response = await AxiosService.AxiosServiceHRM.get(
        `ter_pph/${pkid}`,
      );
      if (response.data && response.data.data) {
        // Wrap the single object in an array
        return [response.data.data];
      }
      return [];
    },
    enabled: !!pkid,
  });
};

export const useGetPPHData = () => {
  return useQuery({
    queryKey: ['pphData'],
    queryFn: async () => {
      const response = await AxiosService.AxiosServiceHRM.get('ter_pph/');
      if (response.data && response.data.data) {
        return response.data.data;
      }
      return [];
    },
  });
};

export const useGetAllPPH = () => {
  return useQuery({
    queryKey: ['listPPH'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get('ter_pph/');
      return data.data;
    },
  });
};

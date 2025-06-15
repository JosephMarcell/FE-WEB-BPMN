import { useQuery } from '@tanstack/react-query';

import { PPHProperty } from '@/helpers/utils/hrm/tax_variables/pph'; // Adjust the import path as necessary
import AxiosService from '@/services/axiosService';

export const useGetAllPPH = () => {
  return useQuery({
    queryKey: ['listPPH'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get('ter_pph/');
      return data.data;
    },
  });
};

export const useGetCategoryPPH = () => {
  return useQuery<PPHProperty[]>({
    queryKey: ['listPPH'],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get<{
        data: PPHProperty[];
      }>('ter_pph/');
      const uniqueCategories = data.data.reduce<PPHProperty[]>(
        (acc, current) => {
          const x = acc.find(
            item => item.ter_category === current.ter_category,
          );
          if (!x) {
            return [...acc, current];
          } else {
            return acc;
          }
        },
        [],
      );
      return uniqueCategories;
    },
  });
};

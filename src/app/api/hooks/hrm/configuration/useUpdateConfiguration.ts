import { useMutation } from '@tanstack/react-query';

import { ConfigurationProperty } from '@/helpers/utils/hrm/configuration';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: ConfigurationProperty;
}
export const useUpdateConfiguration = () => {
  return useMutation({
    mutationKey: ['updateConfigurationByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `configuration/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

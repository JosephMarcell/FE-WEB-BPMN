import { useMutation } from '@tanstack/react-query';

import { BlueCollarWitholdCertificateProperty } from '@/helpers/utils/hrm/blue_collar_withold_certificate';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: BlueCollarWitholdCertificateProperty;
}

export const useUpdateBlueCollarWitholdCertificate = () => {
  return useMutation({
    mutationKey: ['updateBlueCollarWitholdCertificateByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `bukpot_blue/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

import { useMutation } from '@tanstack/react-query';

import { WhiteCollarWitholdCertificateProperty } from '@/helpers/utils/hrm/white_collar_withold_certificate';
import AxiosService from '@/services/axiosService';
interface Update {
  pkid: string | number;
  data: WhiteCollarWitholdCertificateProperty;
}

export const useUpdateWhiteCollarWitholdCertificate = () => {
  return useMutation({
    mutationKey: ['updateWhiteCollarWitholdCertificateByPkid'],
    mutationFn: async ({ pkid, data }: Update) => {
      const response = await AxiosService.AxiosServiceHRM.put(
        `bukpot/${pkid}`,
        data,
      );
      return response.data;
    },
  });
};

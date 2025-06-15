import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useCountWhiteCollarWitholdCertificateByPkid = (
  ptkp_id: number,
  penghasilan_netto: number,
) => {
  return useQuery({
    queryKey: [ptkp_id],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `bukpot/count_neto/${ptkp_id}/${penghasilan_netto}`,
      );
      return data.data;
    },
    enabled: !!ptkp_id,
  });
};

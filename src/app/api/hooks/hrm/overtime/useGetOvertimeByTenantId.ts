import { useQuery } from '@tanstack/react-query';

import AxiosService from '@/services/axiosService';

export const useGetOvertimeByTenantId = (tenantId: number) => {
  return useQuery({
    queryKey: ['overtime', tenantId],
    queryFn: async () => {
      const { data } = await AxiosService.AxiosServiceHRM.get(
        `overtime/?tenant=${tenantId}`,
      );
      return data.data;
    },
    enabled: !!tenantId,
  });
};

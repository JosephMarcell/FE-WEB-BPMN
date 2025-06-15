/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';

import { useGisFilter } from '@/hooks/gis/useGisFilter';

import getGisProvinsi from '@/services/gis/getGisProvince';

export const useGisProvince = () => {
  const params = useGisFilter((state: any) => state.params);

  return useQuery({
    queryKey: ['gis-provinsi', params],
    queryFn: () => getGisProvinsi(params),
    placeholderData: prev => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

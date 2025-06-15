/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQuery } from '@tanstack/react-query';

import { useGisFilter } from '@/hooks/gis/useGisFilter';

import getGisKota from '@/services/gis/getGisKota';

export const useGisKota = (props: any) => {
  const params = useGisFilter((state: any) => state.params);
  const newParams = {
    ...props,
    params,
  };

  return useQuery({
    queryKey: ['gis-kota', newParams],
    queryFn: () => getGisKota(newParams),
    placeholderData: prev => prev,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

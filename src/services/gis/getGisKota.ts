/* eslint-disable @typescript-eslint/no-explicit-any */

export const getGisKota = async (props: any) => {
  const filters = JSON.stringify({
    isCity: props.isCity,
    name: props.name,
    params: props.params,
  });
  const response = await fetch(
    `/api/gis/kota?filter=${encodeURIComponent(filters)}`,
  );
  const results = await response.json();

  return results;
};

export default getGisKota;

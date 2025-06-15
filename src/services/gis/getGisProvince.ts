/* eslint-disable @typescript-eslint/no-explicit-any */

const getGisProvinsi = async (filter: any) => {
  const hasFilters = filter
    ? Object.keys(filter).filter((item: any) => filter[item].length)
    : [];

  const filters = hasFilters.length ? filter : false;

  const guru = await getGuru(filters);

  return {
    guru: guru.guru,
    provincies: guru.provincies,
  };
};

const getGuru = async (filter: any) => {
  const filters = filter ? JSON.stringify(filter) : false;
  const response = await fetch(`/api/gis/guru?filter=${filters}`);
  const results = await response.json();

  return results;
};

export const formatter = (number: number) =>
  number
    .toLocaleString('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })
    .replace('Rp', '')
    .trim();

export const handleFilter = (parsedResult: any, filter: any) => {
  return parsedResult.filter((item: any) => {
    const provinsi = filter?.k_provinsi
      ? parseInt(filter.k_provinsi) === parseInt(item.k_provinsi)
      : true;

    const kota = filter?.k_kota
      ? parseInt(filter.k_kota) === parseInt(item.k_kota)
      : true;

    return provinsi && kota;
  });
};

export default getGisProvinsi;

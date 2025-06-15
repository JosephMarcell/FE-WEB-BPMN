/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable unused-imports/no-unused-vars */
import { NextRequest, NextResponse } from 'next/server';

import pool from '@/lib/posgreConnection';

export const dynamic = 'force-dynamic';

async function nasional(rows: any[], filter: any) {
  const parsedResult = rows;
  const filteredResponse: any[] = parsedResult;

  const drone_aktif = filteredResponse.length;

  const data = {
    cities: filteredResponse,
    provinsi: filteredResponse[0]?.provinsi,
    data: {
      drone: {
        total: drone_aktif,
      },
    },
  };

  return NextResponse.json(data, { status: 200 });
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const filters = url.searchParams.get('filter');
    const filter = filters ? JSON.parse(decodeURIComponent(filters)) : filters;
    // const nameSlug = filter?.name ? filter.name.replace(/\s+/g, '-') : '';

    const whereExtras: string[] = [];

    if (filter?.params?.name) {
      const formattedName = replaceCityName(filter.params.name);
      whereExtras.push(`LOWER(location.city) LIKE '%${formattedName}%'`);
    }

    if (filter?.isCity) {
      whereExtras.push(`location.city = '${replaceCityName(filter.name)}'`);
    } else {
      whereExtras.push(`location.province = '${filter.name}'`);
    }

    const clause = whereExtras.join(' AND ');

    // Fetch the data from the database
    const result = await pool.query(`
      SELECT * FROM location WHERE ${clause}
    `);

    const rows = result.rows;

    if (Array.isArray(rows)) {
      return nasional(rows, filter);
    } else {
      throw new Error('Query result is not an array');
    }
  } catch (error: any) {
    console.error(error);

    return NextResponse.json({ message: error?.message }, { status: 400 });
  }
}

const replaceCityName = (name: any) => {
  const lowerName = name.toLowerCase().trim();

  if (lowerName.startsWith('kab.')) {
    return lowerName.replace('kab.', 'kabupaten').trim();
  }

  if (lowerName.startsWith('kabupaten') || lowerName.startsWith('kota')) {
    return lowerName;
  }

  return `kabupaten ${lowerName}`;
};

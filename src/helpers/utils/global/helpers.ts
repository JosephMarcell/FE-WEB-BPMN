/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-empty */
/* eslint-disable prefer-const */

import * as yup from 'yup';

export function getRandomColor() {
  let letters = '0123456789ABCDEF',
    color = '#',
    generatedNumber,
    i;
  for (i = 0; i < 6; i++) {
    generatedNumber = Math.floor(Math.random() * 16);
    color += letters[generatedNumber];
  }

  return color;
}

export function isJSON(str: string | null) {
  try {
    if (str) {
      return JSON.parse(str);
    }
  } catch (e) {
    // console.log(e);
  }

  return false;
}

export const sumArrayMultipleKeys = (array: any[], keys: any[]) =>
  array?.reduce((a, v) => {
    keys.forEach(k => {
      a[k] = (a[k] ?? 0) + +v[k];
    });

    return a;
  }, {});

export const sumArraySingleKey = (array: any[], key: string) =>
  array.reduce((acc, val) => Number(acc) + Number(val[key]), 0);

export const createYupSchema = (fields: any[]) => {
  const schema = fields.reduce((schema: any, field: any) => {
    return field.rules ? { ...schema, [field.name]: field.rules } : schema;
  }, {});

  return yup.object().shape(schema);
};

export const dateFormat = (timestamp: Date) =>
  new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(timestamp);

export function totalCounter(rows: any[], columns: string[], outName: string) {
  return rows.map((row: any) => {
    const total = columns.reduce((acc, prop) => {
      const value = parseFloat(row[prop]) || 0;
      return acc + value;
    }, 0);

    return {
      ...row,
      [outName]: total,
    };
  });
}

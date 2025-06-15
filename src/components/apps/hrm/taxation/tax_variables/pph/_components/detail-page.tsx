import React from 'react';

import { writeCurrency } from '@/lib/money';

import { PPHProperty } from '@/helpers/utils/hrm/tax_variables/pph';

interface PPHDetailTableProps {
  data: PPHProperty[];
}

const handleWriteCurrency = (value: number) => writeCurrency(value);

const PPHDetailTable: React.FC<PPHDetailTableProps> = ({ data }) => {
  return (
    <div className='overflow-x-auto'>
      <table className='min-w-full divide-y divide-gray-200'>
        <thead className='bg-gray-50'>
          <tr>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Number
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Code
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Minimal Income
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Maximal Income
            </th>
            <th className='px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500'>
              Ter Percentage
            </th>
          </tr>
        </thead>
        <tbody className='divide-y divide-gray-200 bg-white'>
          {data.map((item, index) => (
            <tr key={item.pkid}>
              <td className='whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900'>
                {index + 1}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {item.code}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {handleWriteCurrency(item.income_min || 0)}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {(item.income_max as number) > 9999999900
                  ? 'MAX'
                  : handleWriteCurrency(item.income_max || 0)}
              </td>
              <td className='whitespace-nowrap px-6 py-4 text-sm text-gray-500'>
                {item.ter_pct}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PPHDetailTable;

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

import RenderDataTable from '@/components/commons/data-tables';

import { useHardDeleteCurrency } from '@/app/api/hooks/cash_bank/currency/useHardDeleteCurrency';

interface MyData {
  [key: string]: unknown;
}

interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
  exportCSV?: () => void;
}

const CurrencyTable = <T extends object>({
  data,
  isLoading,
  refetch = () => undefined,
}: // exportCSV,
IProps<T>) => {
  useDispatch();
  usePathname();
  const { mutateAsync: deleteCurrency } = useHardDeleteCurrency();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Currency Code' },
    { accessor: 'name', title: 'Currency Name' },
    { accessor: 'symbol', title: 'Currency Symbol' },
    { accessor: 'created_by', title: 'Created By' },
    { accessor: 'created_date', title: 'Created Date' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDeleteRow = async (id: number) => {
    await deleteCurrency(id);
    refetch();
  };

  return (
    <RenderDataTable
      title='Currency Management'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/cash_bank/currency'
      action='RUD'
      // exportCSV={exportCSV}
      deleteFunc={handleDeleteRow}
    />
  );
};

export default CurrencyTable;

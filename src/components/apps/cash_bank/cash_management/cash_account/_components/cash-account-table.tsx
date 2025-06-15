import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

import RenderDataTable from '@/components/commons/data-tables';

import { useHardDeleteCashAccount } from '@/app/api/hooks/cash_bank/cash_account/useHardDeleteCashAccount';

interface MyData {
  [key: string]: unknown;
}

interface CashAccountData extends MyData {
  pkid: number;
  code: string;
  currency_code: string;
  coa_id: string;
  cash_name: string;
  account_name: string;
  account_type: string;
  balance: number;
  status: string;
  description: string;
  created_by: string;
  created_date: string;
  action?: string;
}

interface IProps {
  data?: CashAccountData[];
  isLoading?: boolean;
  refetch?: () => void;
  exportCSV?: () => void;
}

const CashAccountTable = ({
  data,
  isLoading,
  refetch = () => undefined,
}: // exportCSV,
IProps) => {
  useDispatch();
  usePathname();
  const { mutateAsync: deleteCashAccount } = useHardDeleteCashAccount();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Cash Account Code' },
    { accessor: 'currency_code', title: 'Currency Code' },
    { accessor: 'coa_id', title: 'COA ID' },
    { accessor: 'cash_name', title: 'Cash Name' },
    {
      accessor: 'account_name',
      title: 'Account Name',
      render: (record: MyData) => <span>{String(record.account_name)}</span>,
    },
    { accessor: 'account_type', title: 'Account Type' },
    { accessor: 'balance', title: 'Balance' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'created_by', title: 'Created By' },
    { accessor: 'created_date', title: 'Created Date' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDeleteRow = async (id: number) => {
    await deleteCashAccount(id);
    refetch();
  };

  return (
    <RenderDataTable
      title='Cash Account Management'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/cash_bank/cash_account'
      action='RUD'
      // exportCSV={exportCSV}
      deleteFunc={handleDeleteRow}
    />
  );
};

export default CashAccountTable;

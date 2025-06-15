import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch } from 'react-redux';

import RenderDataTable from '@/components/commons/data-tables';

import { useHardDeleteBankAccount } from '@/app/api/hooks/cash_bank/bank_account/useHardDeleteBankAccount';

interface MyData {
  [key: string]: unknown;
}

interface BankAccountData extends MyData {
  pkid: number;
  code: string;
  currency_code: string;
  coa_id: string;
  bank_name: string;
  bank_code: string;
  bank_country: string;
  branch_name: string;
  account_number: string;
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
  data?: BankAccountData[];
  isLoading?: boolean;
  refetch?: () => void;
  exportCSV?: () => void;
}

const BankAccountTable = ({
  data,
  isLoading,
  refetch = () => undefined,
}: // exportCSV,
IProps) => {
  useDispatch();
  usePathname();
  const { mutateAsync: deleteBankAccount } = useHardDeleteBankAccount();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Bank Account Code' },
    { accessor: 'currency_code', title: 'Currency Code' },
    { accessor: 'coa_id', title: 'COA ID' },
    { accessor: 'bank_name', title: 'Bank Name' },
    { accessor: 'bank_code', title: 'Bank Code' },
    { accessor: 'bank_country', title: 'Bank Country' },
    { accessor: 'branch_name', title: 'Branch Name' },
    {
      accessor: 'account_number',
      title: 'Account Number',
      render: (record: MyData) => <span>{String(record.account_number)}</span>,
    },
    { accessor: 'account_name', title: 'Account Name' },
    { accessor: 'account_type', title: 'Account Type' },
    { accessor: 'balance', title: 'Balance' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'created_by', title: 'Created By' },
    { accessor: 'created_date', title: 'Created Date' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDeleteRow = async (id: number) => {
    await deleteBankAccount(id);
    refetch();
  };

  return (
    <RenderDataTable
      title='Bank Account Management'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/cash_bank/bank_account'
      action='RUD'
      // exportCSV={exportCSV}
      deleteFunc={handleDeleteRow}
    />
  );
};

export default BankAccountTable;

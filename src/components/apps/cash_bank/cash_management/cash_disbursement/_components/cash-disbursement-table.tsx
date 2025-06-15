import React from 'react';

import RenderDataTable from '@/components/commons/data-tables';

import { useHardDeleteCashDisbursement } from '@/app/api/hooks/cash_bank/cash_disbursement/useHardDeleteCashDisbursement';

interface MyData {
  [key: string]: unknown;
}

interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
  exportCSV?: () => void;
}

const CashDisbursementTable = <T extends object>({
  data,
  isLoading,
  refetch = () => undefined,
}: // exportCSV,
IProps<T>) => {
  const { mutateAsync: deleteCashDisbursement } =
    useHardDeleteCashDisbursement();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Code' },
    { accessor: 'cash_account_code', title: 'Cash Account Code' },
    { accessor: 'reference_code', title: 'Reference Code' },
    { accessor: 'disbursement_date', title: 'Disbursement Date' },
    { accessor: 'disbursement_amount', title: 'Disbursement Amount' },
    { accessor: 'payment_method', title: 'Payment Method' },
    { accessor: 'admin_fee', title: 'Admin Fee' },
    { accessor: 'total', title: 'Total' },
    { accessor: 'payment_type', title: 'Payment Type' },
    { accessor: 'payment_reference', title: 'Payment Reference' },
    { accessor: 'additional_notes', title: 'Additional Notes' },
    { accessor: 'created_by', title: 'Created By' },
    { accessor: 'created_date', title: 'Created Date' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDeleteRow = async (id: number) => {
    await deleteCashDisbursement(id);
    refetch();
  };

  return (
    <RenderDataTable
      title='Cash Disbursement (Purchasing)'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/cash_bank/cash_disbursement'
      action='RUD'
      // exportCSV={exportCSV}
      deleteFunc={handleDeleteRow}
    />
  );
};

export default CashDisbursementTable;

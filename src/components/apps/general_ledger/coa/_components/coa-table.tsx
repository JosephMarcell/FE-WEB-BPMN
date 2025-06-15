import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const CoaTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'number', title: 'Code' },
    { accessor: 'name', title: 'Nama' },
    { accessor: 'account_type_pkid', title: 'Tipe Akun' },
    { accessor: 'opening_balance', title: 'Saldo' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Chart of Account'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RU'
      detailPath='/general_ledger/coa/'
    />
  );
};

export default CoaTable;

import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const JournalTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'code', title: 'Code' },
    { accessor: 'ref', title: 'Nomor Transaksi' },
    { accessor: 'post_date', title: 'Tanggal' },
    { accessor: 'notes', title: 'Keterangan' },
    { accessor: 'amount', title: 'Total' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Journal Management'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/general_ledger/journal_management/'
      action='RUD'
    />
  );
};

export default JournalTable;

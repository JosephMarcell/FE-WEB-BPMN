import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const AlocationOfProductionTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'month', title: 'Bulan' },
    { accessor: 'year', title: 'Tahun' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Alocation Of Production'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RUD'
    />
  );
};

export default AlocationOfProductionTable;

import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const ItemsTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Kode Item' },
    { accessor: 'name', title: 'Nama Item' },
    { accessor: 'buy_price', title: 'Harga Beli' },
    { accessor: 'sale_price', title: 'Harga Jual' },
    { accessor: 'Unit.code', title: 'Satuan' },
    { accessor: 'ItemCategory.name', title: 'Tipe Item' },
    { accessor: 'Tax.name', title: 'Jenis Pajak' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Item Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid', 'action']}
    />
  );
};

export default ItemsTable;

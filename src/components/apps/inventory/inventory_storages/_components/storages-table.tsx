import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const InventoryTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'item.code', title: 'ID' },
    { accessor: 'item.name', title: 'Item Code' },
    { accessor: 'item_name', title: 'Item Name' },
    { accessor: 'all_quantity', title: 'All Quantity' },
    { accessor: 'clean_quantity', title: 'Clean Quantity' },
    { accessor: 'Unit.code', title: 'Unit' },
    { accessor: 'ItemCategory.name', title: 'Item Type' },
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

export default InventoryTable;

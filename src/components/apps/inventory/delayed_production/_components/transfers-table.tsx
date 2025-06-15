import { InventoryStatusLabel } from '@/components/apps/inventory/_components/inventory_status_label';
import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const DelayedProductionTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'pdr_id', title: 'Production ID' },
    { accessor: 'Item.name', title: 'Item Name' },
    { accessor: 'Item.code', title: 'Item Code' },
    { accessor: 'quantity', title: 'Quantity' },
    { accessor: 'Item.Unit.code', title: 'Unit' },
    {
      accessor: 'status',
      title: 'Status',
      render: (row: MyData) => (
        <InventoryStatusLabel
          status={row.status as 'waiting' | 'on production'}
        />
      ),
    },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Delayed Production Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid', 'action']}
    />
  );
};

export default DelayedProductionTable;

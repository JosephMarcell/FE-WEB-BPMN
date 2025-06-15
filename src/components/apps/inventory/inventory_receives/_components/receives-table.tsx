import { InventoryTypeLabel } from '@/components/apps/inventory/_components/inventory_type_label';
import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteInventoryReceive } from '@/app/api/hooks/inventory/inventory_receive/useDeleteInventoryReceive';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const ReceivesTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteInventoryReceive } = useDeleteInventoryReceive();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'received_date', title: 'Date' },
    {
      accessor: 'type',
      title: 'Type',
      render: (row: MyData) => (
        <InventoryTypeLabel type={row.type as 'purchase' | 'sales'} />
      ),
    },

    { accessor: 'reference_number', title: 'Reference Number' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Receives Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RUD'
      deleteFunc={deleteInventoryReceive}
      detailPath='/inventory/inventory_receives'
    />
  );
};

export default ReceivesTable;

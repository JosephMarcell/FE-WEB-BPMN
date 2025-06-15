import { InventoryTypeLabel } from '@/components/apps/inventory/_components/inventory_type_label';
import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteInventoryTransfer } from '@/app/api/hooks/inventory/inventory_transfer/useDeleteInventoryTransfer';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const TransfersTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteInventoryTransfer } = useDeleteInventoryTransfer();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'transfer_date', title: 'Transfer Date' },
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
      title='Transfers Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RUD'
      deleteFunc={deleteInventoryTransfer}
      detailPath='/inventory/inventory_transfers'
    />
  );
};

export default TransfersTable;

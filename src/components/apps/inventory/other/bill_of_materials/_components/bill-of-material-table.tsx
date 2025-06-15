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

const BillOfMaterialTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteInventoryReceive } = useDeleteInventoryReceive();
  const cols = [
    { accessor: 'code', title: 'BOM Code' },
    { accessor: 'effective_date', title: 'Effective Date' },
    { accessor: 'expiration_date', title: 'Expiration Date' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Bill Of Material Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RUD'
      deleteFunc={deleteInventoryReceive}
      detailPath='/inventory/bill_of_materials'
    />
  );
};

export default BillOfMaterialTable;

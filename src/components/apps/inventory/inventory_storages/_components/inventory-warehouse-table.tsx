import RenderDataTable from '@/components/commons/data-tables';

import { ItemProperty } from '@/helpers/utils/inventory/item/item';
import { WarehouseProperty } from '@/helpers/utils/inventory/master_data/warehouse/warehouse';

interface MyData {
  [key: string]: unknown;
  item: ItemProperty;
  warehouse: WarehouseProperty;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const InventorWarehouseTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    {
      accessor: 'item.code',
      title: 'Item Code',
      render: (row: { item: ItemProperty }) => row.item.code,
    },
    {
      accessor: 'item.name',
      title: 'Item Name',
      render: (row: { item: ItemProperty }) => row.item.name,
    },
    { accessor: 'quantity', title: 'Quantity' },
    {
      accessor: 'item.unit',
      title: 'Unit',
      render: (row: { item: ItemProperty }) => row.item.unit?.name,
    },
    {
      accessor: 'warehouse.name',
      title: 'Warehouse Name',
      render: (row: { warehouse: WarehouseProperty }) => row.warehouse.name,
    },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Inventory Warehouse'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      detailPath='/assets/asset_disposal'
      action='RU'
    />
  );
};

export default InventorWarehouseTable;

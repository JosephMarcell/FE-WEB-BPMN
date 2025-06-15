import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';

interface MyData {
  [key: string]: unknown;
  ProductionOrder: {
    code: string;
  };
  ReceiveProduct: {
    code: string;
  };
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const InspectionProductTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetCategory } = useDeleteAssetCategory();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    {
      accessor: 'production_order_pkid',
      title: 'Production Order Code',
      render: (row: MyData) => row.ProductionOrder.code,
    },
    {
      accessor: 'receive_product_pkid',
      title: 'Receive Product Code',
      render: (row: MyData) => row.ReceiveProduct.code,
    },
    { accessor: 'item_pkid', title: 'Item Name' },
    { accessor: 'entry_date', title: 'Entry Date' },
    { accessor: 'quantity', title: 'Quantity Produced' },
    { accessor: 'quantity_used', title: 'Quantity Used' },
    { accessor: 'quantity_reject', title: 'Quantity Reject' },
    { accessor: 'result', title: 'Result' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];
  return (
    <RenderDataTable
      title='Inspection Product'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      // approveFunc={approveInspectionProduct}
      detailPath='/manufacturing/inspection_product'
      action='AU'
    />
  );
};

export default InspectionProductTable;

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';

interface MyData {
  [key: string]: unknown;
  ProductionOrder: {
    code: string;
  };
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const IssueMaterialTable = <T extends object>({
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
    { accessor: 'action', title: 'Action' },
  ];
  return (
    <RenderDataTable
      title='Issue Material'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      detailPath='/manufacturing/issue_material'
      // approveFunc={bulkUpdateIssueMaterial}
      customDetailPath='production_order_pkid'
      action='RA'
    />
  );
};

export default IssueMaterialTable;

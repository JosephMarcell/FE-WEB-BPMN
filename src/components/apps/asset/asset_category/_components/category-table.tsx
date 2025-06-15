import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const CategoryTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetCategory } = useDeleteAssetCategory();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Nama Kategori' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Asset Category'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      detailPath='/assets/asset_category'
      action='RUD'
    />
  );
};

export default CategoryTable;

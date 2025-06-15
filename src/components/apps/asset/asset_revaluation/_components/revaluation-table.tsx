import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetRevaluation } from '@/app/api/hooks/fixed_asset/asset_revaluation/useDeleteAssetRevaluation';
import { Asset, RowData } from '@/helpers/utils/fixed_asset/general';

interface MyData {
  [key: string]: unknown;
  asset: Asset;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const RevaluationTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetRevaluation } = useDeleteAssetRevaluation();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'title', title: 'Judul Revaluasi' },
    {
      accessor: 'asset.name',
      title: 'Nama Aset',
      render: (row: RowData) => row.asset.name,
    },
    { accessor: 'revaluation_date', title: 'Tanggal Revaluasi' },
    { accessor: 'revaluation_year', title: 'Umur Manfaat Baru' },
    { accessor: 'revaluation_amount', title: 'Nilai Revaluasi' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Asset Revaluation'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetRevaluation}
      // approveFunc={approveAssetRevaluation}
      detailPath='/assets/asset_revaluation'
      action='RUA'
    />
  );
};

export default RevaluationTable;

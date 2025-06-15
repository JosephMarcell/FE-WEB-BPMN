import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';
import { Asset } from '@/helpers/utils/fixed_asset/general';

interface MyData {
  [key: string]: unknown;
  asset: Asset;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const MachineTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetCategory } = useDeleteAssetCategory();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    // {
    //   accessor: 'asset.name',
    //   title: 'Nama Aset',
    //   render: (row: RowData) => row.asset.name,
    // },
    { accessor: 'description', title: 'Deskripsi' },
    { accessor: 'cost_per_hour', title: 'Biaya / jam' },
    { accessor: 'last_used_date', title: 'Terakhir Digunakan' },
    { accessor: 'waiting_time', title: 'Waktu Tunggu' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Machine'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      detailPath='/manufacturing/machine'
      action='RUD'
    />
  );
};

export default MachineTable;

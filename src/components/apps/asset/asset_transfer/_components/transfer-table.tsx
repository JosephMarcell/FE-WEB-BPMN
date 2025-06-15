import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetTransfer } from '@/app/api/hooks/fixed_asset/asset_transfer/useDeleteAssetTransfer';
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
const TransferTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetTransfer } = useDeleteAssetTransfer();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'title', title: 'Judul Revaluasi' },
    {
      accessor: 'asset.name',
      title: 'Nama Aset',
      render: (row: RowData) => row.asset.name,
    },
    { accessor: 'transfer_date', title: 'Tanggal Pindah Aset' },
    { accessor: 'new_address', title: 'Alamat Baru' },
    { accessor: 'new_department', title: 'Departemen Baru' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Asset Transfer'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetTransfer}
      // approveFunc={approveAssetTransfer}
      detailPath='/assets/asset_transfer'
      action='RUA'
    />
  );
};

export default TransferTable;

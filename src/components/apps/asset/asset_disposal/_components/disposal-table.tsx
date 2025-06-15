import RenderDataTable from '@/components/commons/data-tables';

import { useApproveRequestAssetDisposal } from '@/app/api/hooks/fixed_asset/asset_disposal/useApproveRequestAssetDisposal';
import { useDeleteAssetDisposal } from '@/app/api/hooks/fixed_asset/asset_disposal/useDeleteAssetDisposal';
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
const DisposalTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetDisposal } = useDeleteAssetDisposal();
  useApproveRequestAssetDisposal();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'title', title: 'Judul Disposal' },
    {
      accessor: 'asset.name',
      title: 'Nama Aset',
      render: (row: RowData) => row.asset.name,
    },
    { accessor: 'disposal_reason', title: 'Alasan Disposal' },
    { accessor: 'disposal_date', title: 'Tanggal Disposal' },
    { accessor: 'disposal_method', title: 'Metode Disposal' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Asset Disposal'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetDisposal}
      // approveFunc={approveAssetDisposal}
      detailPath='/assets/asset_disposal'
      action='RUA'
    />
  );
};

export default DisposalTable;

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetStockTake } from '@/app/api/hooks/fixed_asset/asset_stock_take/useDeleteAssetStockTake';
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
const StockTakeTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetStockTake } = useDeleteAssetStockTake();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'title', title: 'Judul Stock Take' },
    {
      accessor: 'asset.name',
      title: 'Nama Aset',
      render: (row: RowData) => row.asset.name,
    },
    { accessor: 'stock_take_date', title: 'Tanggal Stock Take' },
    { accessor: 'stock_take_by', title: 'Nama Inspektor' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Asset Stock Take'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetStockTake}
      // approveFunc={approveAssetStockTake}
      detailPath='/assets/asset_stock_take'
      action='RUA'
    />
  );
};

export default StockTakeTable;

import { formatDate } from '@fullcalendar/core';

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';

interface MyData {
  [key: string]: unknown;
  start: string;
  end: string;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const ProductionOrderTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetCategory } = useDeleteAssetCategory();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Kode Perintah Produksi' },
    { accessor: 'quantity', title: 'Kuantitas Produksi' },
    {
      accessor: 'start',
      title: 'Waktu Mulai Produksi',
      render: (row: { start: string }) => formatDate(row.start),
    },
    {
      accessor: 'end',
      title: 'Waktu Selesai Produksi',
      render: (row: { end: string }) => formatDate(row.end),
    },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Production Order'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      detailPath='/manufacturing/production_order'
      action='RU'
    />
  );
};

export default ProductionOrderTable;

import { formatDate } from '@fullcalendar/core';

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteAssetCategory } from '@/app/api/hooks/fixed_asset/asset_category/useDeleteAssetCategory';

interface MyData {
  [key: string]: unknown;
  start: string;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const ProductionRequestTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteAssetCategory } = useDeleteAssetCategory();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Kode Permintaan Produksi' },
    {
      accessor: 'start',
      title: 'Waktu Mulai Produksi',
      render: (row: { start: string }) => formatDate(row.start),
    },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Production Request'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteAssetCategory}
      detailPath='/manufacturing/production_request'
      action='R'
    />
  );
};

export default ProductionRequestTable;

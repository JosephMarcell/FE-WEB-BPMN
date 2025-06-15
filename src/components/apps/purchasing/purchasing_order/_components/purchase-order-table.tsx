import { formatDate } from '@fullcalendar/core';

import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
  createdAt: string;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const PurchaseOrderTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Kode Purchase' },
    {
      accessor: 'createdAt',
      title: 'Tanggal Permintaan',
      render: (row: MyData) =>
        formatDate(row.createdAt, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
    },
    { accessor: 'Supplier.name', title: 'Nama Supplier' },
    { accessor: 'invoice', title: 'Nomor Invoice' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Purchase Order Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RU'
      detailPath='/purchasing/purchase_order'
    />
  );
};

export default PurchaseOrderTable;

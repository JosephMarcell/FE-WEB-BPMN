import { formatDate } from '@fullcalendar/core';

import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
  requested_date: string;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const PurchaseRequestTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Kode Purchase' },
    {
      accessor: 'requested_date',

      title: 'Tanggal Permintaan',
      render: (row: MyData) =>
        formatDate(row.requested_date, {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        }),
    },
    { accessor: 'currency_code', title: 'Currency Code' },
    { accessor: 'priority', title: 'Priority' },
    { accessor: 'department', title: 'Department Name' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Purchase Request Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RU'
      detailPath='/purchasing/purchase_request'
    />
  );
};

export default PurchaseRequestTable;

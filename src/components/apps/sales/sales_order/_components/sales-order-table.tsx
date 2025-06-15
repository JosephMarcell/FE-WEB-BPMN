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

const SalesOrderTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Kode Sales' },
    {
      accessor: 'order_date',
      title: 'Order Date',
    },
    {
      accessor: 'delivery_date',
      title: 'Delivery Date',
    },
    { accessor: 'total_amount', title: 'Total Harga' },

    { accessor: 'description', title: 'Description' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'delivery_status', title: 'Delivery Status' },
    { accessor: 'payment_status', title: 'Payment Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Sales Order Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RU'
    />
  );
};

export default SalesOrderTable;

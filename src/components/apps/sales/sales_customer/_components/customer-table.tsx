import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const CustomerTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Nama Customer' },
    { accessor: 'contact_number', title: 'No. Telepon' },
    { accessor: 'email', title: 'Email' },
    { accessor: 'address', title: 'Alamat' },
    { accessor: 'npwp', title: 'NPWP' },
    { accessor: 'post_code', title: 'Kode Pos' },
    { accessor: 'fax_number', title: 'Fax Number' },
    { accessor: 'industry', title: 'Industry' },
    { accessor: 'customer_type', title: 'Customer Type' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Customer Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      action='RU'
      detailPath='/sales/customer'
    />
  );
};

export default CustomerTable;

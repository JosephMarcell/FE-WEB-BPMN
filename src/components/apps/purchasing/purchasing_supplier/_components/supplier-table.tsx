import RenderDataTable from '@/components/commons/data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const SupplierTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Nama Supplier' },
    { accessor: 'contact_number', title: 'No. Telepon' },
    { accessor: 'contact_person', title: 'Contact Person' },
    { accessor: 'business_type', title: 'Business Type' },
    { accessor: 'email', title: 'Email' },
    { accessor: 'fax_number', title: 'Fax Number' },
    { accessor: 'payment_terms', title: 'Payment Terms' },
    { accessor: 'address', title: 'Alamat' },
    { accessor: 'npwp', title: 'NPWP' },
    { accessor: 'postal_code', title: 'Kode Pos' },
    { accessor: 'bank_account', title: 'Bank Account' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Supplier Table'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid', 'action']}
      action='RU'
      detailPath='/purchasing/supplier'
    />
  );
};

export default SupplierTable;

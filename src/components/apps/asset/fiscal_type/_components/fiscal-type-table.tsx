import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteFiscalType } from '@/app/api/hooks/fixed_asset/fiscal_type/useDeleteFiscalType';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}
const FiscalTypeTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteFiscalType } = useDeleteFiscalType();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Nama Fiscal Type' },
    { accessor: 'depreciation_method', title: 'Metode Depresiasi' },
    { accessor: 'estimated_life', title: 'Umur Manfaat' },
    { accessor: 'depreciation_rate', title: 'Nilai Depresiasi (%)' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderDataTable
      title='Fiscal Type'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['pkid']}
      deleteFunc={deleteFiscalType}
      detailPath='/assets/fiscal_type'
      action='RUD'
    />
  );
};

export default FiscalTypeTable;

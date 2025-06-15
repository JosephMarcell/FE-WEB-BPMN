import { writeCurrency } from '@/lib/money';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends MyData> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}

const handleWriteCurrency = (value: number) => writeCurrency(value);

const VariableSalaryTypesTable = <T extends MyData>({
  data,
  isLoading,
  permission,
  refetch,
}: IProps<T>) => {
  const formattedData = data?.map(item => ({
    ...item,
    amount: handleWriteCurrency(item.amount as number),
    tunjangan_tetap: handleWriteCurrency(item.tunjangan_tetap as number),
  }));

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'code', title: 'Code' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'amount', title: 'Jumlah PTKP' },
    { accessor: 'ter_category', title: 'Ter PPH' },
    { accessor: 'tunjangan_tetap', title: 'Tunjangan Keluarga' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='PTKP'
      data={formattedData as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      action={permission}
    />
  );
};

export default VariableSalaryTypesTable;

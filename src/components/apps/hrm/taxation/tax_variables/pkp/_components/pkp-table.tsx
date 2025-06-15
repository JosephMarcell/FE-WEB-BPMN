import { writeCurrency } from '@/lib/money';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends MyData> {
  data?: T[];
  isLoading?: boolean;
  refetch?: () => void;
}

const handleWriteCurrency = (value: number) => writeCurrency(value);

const PKPTable = <T extends MyData>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const formattedData = data?.map(item => ({
    ...item,
    pkp_min: handleWriteCurrency(item.pkp_min as number),
    pkp_max:
      (item.pkp_max as number) === 9007199254740991
        ? 'MAX'
        : handleWriteCurrency(item.pkp_max as number),
    tariff_percentage: `${item.tariff_percentage}%`,
  }));

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'pkp_min', title: 'PKP Min' },
    { accessor: 'pkp_max', title: 'PKP Max' },
    { accessor: 'tariff_percentage', title: 'Tariff Percentage' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='PKP'
      data={formattedData as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      hide_columns={['action']}
    />
  );
};

export default PKPTable;

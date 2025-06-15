import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteReductionName } from '@/app/api/hooks/hrm/reduction_name/useDeleteReductionName';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  permission?: string;
  refetch?: () => void;
}
const ReductionNamesTable = <T extends object>({
  data,
  isLoading,
  permission,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteReductionName } = useDeleteReductionName();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='Reduction Names'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      // hide_columns={['action']}
      deleteFunc={deleteReductionName}
      action={permission}
    />
  );
};

export default ReductionNamesTable;

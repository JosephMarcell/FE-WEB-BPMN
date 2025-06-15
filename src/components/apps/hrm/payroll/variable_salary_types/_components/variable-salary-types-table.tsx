import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteVariableSalaryTypes } from '@/app/api/hooks/hrm/variable_salary_types/useDeleteVariableSalaryTypes';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  isLoading?: boolean;
  permission?: string;
  refetch?: () => void;
}
const VariableSalaryTypesTable = <T extends object>({
  data,
  isLoading,
  permission,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteVariableSalaryTypes } =
    useDeleteVariableSalaryTypes();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'type', title: 'Type' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='Allowance Names'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      // hide_columns={['action']}
      deleteFunc={deleteVariableSalaryTypes}
      action={permission}
    />
  );
};

export default VariableSalaryTypesTable;

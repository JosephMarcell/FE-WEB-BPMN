import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteWhiteCollarPayrollClass } from '@/app/api/hooks/hrm/white_collar_payroll_class/useDeleteWhiteCollarPayrollClass';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const WhiteCollarPayrollClassTable = <T extends object>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteWhiteCollarPayrollClass } =
    useDeleteWhiteCollarPayrollClass();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'nama_golongan', title: 'Nama Golongan' },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <RenderHRMDataTable
      title='White Collar Payroll Class'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={deleteWhiteCollarPayrollClass}
      // hide_columns={['action']}
      detailPath='/hrm/payroll/white_collar_payroll_class'
      action={permission}
    />
  );
};

export default WhiteCollarPayrollClassTable;

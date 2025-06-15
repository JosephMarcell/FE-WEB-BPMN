import axios from 'axios';
import Swal from 'sweetalert2';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteEmployee } from '@/app/api/hooks/hrm/employee/useDeleteEmployee';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const EmployeeTable = <T extends object>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteEmployee } = useDeleteEmployee();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'fullname', title: 'Name' },
    { accessor: 'join_date', title: 'Join Date' },
    { accessor: 'verification_state', title: 'Status Verifikasi' },
    { accessor: 'active_status', title: 'Status Keaktifan' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDelete = async (id: string | number) => {
    try {
      await deleteEmployee(id);

      Swal.fire('Deleted!', 'Your data has been deleted.', 'success').then(
        () => {
          refetch?.();
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Swal.fire('Error!', error?.response?.data?.message, 'error');
      } else {
        Swal.fire('Error!', 'An unexpected error occurred', 'error');
      }
    }
  };

  return (
    <RenderHRMDataTable
      title='Employee'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDelete}
      detailPath='/hrm/employee'
      action={permission}
    />
  );
};

export default EmployeeTable;

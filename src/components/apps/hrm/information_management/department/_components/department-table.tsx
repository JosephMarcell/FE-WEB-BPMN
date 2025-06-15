import axios from 'axios';
import Swal from 'sweetalert2';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteDepartment } from '@/app/api/hooks/hrm/department/useDeleteDepartment';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const DepartmentTable = <T extends object>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteDepartment } = useDeleteDepartment();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'description', title: 'Descriptions' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDelete = async (id: string | number) => {
    try {
      await deleteDepartment(id);

      Swal.fire('Deleted!', 'Your data has been deleted.', 'success').then(
        () => {
          refetch?.();
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Swal.fire('Error!', 'Position exist in this department', 'error');
      } else {
        Swal.fire('Error!', 'An unexpected error occurred', 'error');
      }
    }
  };

  return (
    <RenderHRMDataTable
      title='Department'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDelete}
      hide_columns={[]}
      detailPath='/hrm/information_management/department'
      action={permission}
    />
  );
};

export default DepartmentTable;

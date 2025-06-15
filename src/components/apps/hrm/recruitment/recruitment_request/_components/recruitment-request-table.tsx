import axios from 'axios';
import Swal from 'sweetalert2';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useDeleteRecruitmentRequest } from '@/app/api/hooks/hrm/recruitment_request/useDeleteRecruitmentRequest';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const RecruitmentRequestTable = <T extends object>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteRecruitmentRequest } =
    useDeleteRecruitmentRequest();

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'Position[name]', title: 'Posisi' },
    { accessor: 'needed_number', title: 'Jumlah Dibutuhkan' },
    { accessor: 'already_recruited', title: 'Jumlah Direkrut' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDelete = async (id: string | number) => {
    try {
      await deleteRecruitmentRequest(id);

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
      title='Recruitment Request'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDelete}
      detailPath='/hrm/recruitment/recruitment_request'
      hide_columns={[]}
      action={permission}
    />
  );
};

export default RecruitmentRequestTable;

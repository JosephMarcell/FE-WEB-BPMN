import axios from 'axios';
import Swal from 'sweetalert2';

import RenderHRMDataTable from '@/components/commons/hrm-data-tables';

import { useGetAllDepartment } from '@/app/api/hooks/hrm/department/useGetAllDepartment';
import { useDeletePosition } from '@/app/api/hooks/hrm/position/useDeletePosition';

interface MyData {
  [key: string]: unknown;
}

interface Department {
  pkid: number;
  name: string;
}

interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}

const PositionTable = <T extends MyData>({
  data,
  permission,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deletePosition } = useDeletePosition();
  const { data: listDepartment } = useGetAllDepartment();

  const baseCols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'Department.name', title: 'Department' },
    { accessor: 'type', title: 'Collar Type' },
  ];

  const additionalCols = [
    { accessor: 'tunjangan_tetap', title: 'Tunjangan Tetap' },
    { accessor: 'white_payroll_id', title: 'White Payroll ID' },
    { accessor: 'blue_cost_ph', title: 'Blue Cost PH' },
  ];

  const actionCol = { accessor: 'action', title: 'Action' };

  const handleDelete = async (id: string | number) => {
    try {
      await deletePosition(id);

      Swal.fire('Deleted!', 'Your data has been deleted.', 'success').then(
        () => {
          refetch?.();
        },
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        Swal.fire('Error!', error?.response?.data, 'error');
      } else {
        Swal.fire('Error!', 'An unexpected error occurred', 'error');
      }
    }
  };

  // Function to preprocess data
  const preprocessData = (data: T[] | undefined) => {
    if (!data || !listDepartment) return [];

    return data.map(item => {
      const newItem = { ...item } as MyData;

      if (newItem['type'] === 'Blue') {
        newItem['tunjangan_tetap'] = '-';
      }

      const department = listDepartment?.data.find(
        (dept: Department) => dept.pkid === newItem['department_id'],
      );

      if (department) {
        newItem['Department'] = { name: department.name };
      }

      return newItem;
    });
  };

  // Function to get all possible columns
  const getAllPossibleColumns = () => {
    return [...baseCols, ...additionalCols, actionCol];
  };

  return (
    <RenderHRMDataTable
      title='Position'
      data={preprocessData(data) as MyData[]}
      columns={getAllPossibleColumns()}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDelete}
      detailPath='/hrm/information_management/position'
      action={permission}
    />
  );
};

export default PositionTable;

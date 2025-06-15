import axios from 'axios';
import Swal from 'sweetalert2';

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteUnit } from '@/app/api/hooks/inventory/master_data/unit/useDeleteUnit';

interface MyData {
  [key: string]: unknown;
}

interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}

const UnitTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteUnit } = useDeleteUnit();

  const cols = [
    { accessor: 'code', title: 'Code' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'symbol', title: 'Symbol' },
    {
      accessor: 'conversion_factor',
      title: 'Conversion Factor',
      render: (row: MyData) => {
        const conversionFactor = row.conversion_factor as
          | number
          | null
          | undefined;
        return conversionFactor === 0 ||
          conversionFactor === null ||
          conversionFactor === undefined
          ? '-'
          : parseFloat(conversionFactor.toString()).toString();
      },
    },
    { accessor: 'category', title: 'Category' },
    // { accessor: 'base_unit', title: 'Base Unit' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDelete = async (id: string | number) => {
    try {
      await deleteUnit(id);

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
    <RenderDataTable
      title='Unit'
      data={data as MyData[]}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDelete}
      detailPath=''
      action='RUD'
    />
  );
};

export default UnitTable;

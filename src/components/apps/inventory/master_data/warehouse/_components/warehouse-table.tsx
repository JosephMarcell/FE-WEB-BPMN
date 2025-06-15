import axios from 'axios';
import Swal from 'sweetalert2';

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteWarehouse } from '@/app/api/hooks/inventory/master_data/warehouse/useDeleteWarehouse';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}
const WarehouseTable = <T extends object>({
  data,
  isLoading,
  refetch,
}: IProps<T>) => {
  const { mutateAsync: deleteWarehouse } = useDeleteWarehouse();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'name', title: 'Name' },
    { accessor: 'address', title: 'Address' },
    { accessor: 'city', title: 'City' },
    { accessor: 'state', title: 'State' },
    { accessor: 'country', title: 'Country' },
    { accessor: 'postal_code', title: 'Postal Code' },
    { accessor: 'contact_number', title: 'Contact Number' },
    { accessor: 'action', title: 'Action' },
  ];

  const handleDelete = async (id: string | number) => {
    try {
      await deleteWarehouse(id);

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
      title='Warehouse'
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

export default WarehouseTable;

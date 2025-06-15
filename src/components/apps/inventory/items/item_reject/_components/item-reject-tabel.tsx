import axios from 'axios';
import Swal from 'sweetalert2';

import RenderDataTable from '@/components/commons/data-tables';

import { useDeleteItem } from '@/app/api/hooks/inventory/items/item/useDeleteItem';

interface MyData {
  [key: string]: unknown;
}

interface ItemRejecttData extends MyData {
  code: string;
  name: string;
  purchase_price: number | null;
  selling_price: number | null;
  currency_code: string;
  description: string | null;
  sku: string | null;
  barcode: string | null;
  weight: number | null;
  dimensions: string | null;
  item_category: { name: string };
  unit: { code: string };
  itemType: string;
  tax?: { name: string }; // tax can be undefined
  taxType: string;
  unit_code: string;
  action?: string;
}

interface IProps {
  data?: ItemRejecttData[];
  permission?: string;
  isLoading?: boolean;
  refetch?: () => void;
}

const ItemRejectTable: React.FC<IProps> = ({ data, isLoading, refetch }) => {
  const { mutateAsync: deleteItem } = useDeleteItem();
  const cols = [
    { accessor: 'code', title: 'Item Code' },
    { accessor: 'name', title: 'Item Name' },
    { accessor: 'purchase_price', title: 'Purchase Price (Rp)' },
    { accessor: 'selling_price', title: 'Selling Price (Rp)' },
    { accessor: 'currency_code', title: 'Currency' },
    { accessor: 'itemType', title: 'Item Type' },
    { accessor: 'taxType', title: 'Tax Name' }, // Add this line
    { accessor: 'unit_code', title: 'Unit' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'sku', title: 'SKU' },
    { accessor: 'barcode', title: 'Barcode' },
    { accessor: 'weight', title: 'Weight' },
    { accessor: 'dimensions', title: 'Dimensions' },
    { accessor: 'action', title: 'Action' },
  ];

  // Ensure data is an array
  const dataArray = Array.isArray(data) ? data : data ? [data] : [];

  // Map the data to include itemType, unit_code, and taxType
  const mappedData: ItemRejecttData[] = dataArray.map(item => ({
    ...item,
    itemType: item.item_category.name,
    unit_code: item.unit.code,
    taxType: item.tax ? item.tax.name : '-', // Ensure taxType is properly mapped
  }));

  const handleDelete = async (id: string | number) => {
    try {
      await deleteItem(id);
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
      title='Item Reject'
      data={mappedData}
      columns={cols}
      isLoading={isLoading}
      refetch={refetch}
      deleteFunc={handleDelete}
      detailPath='/inventory/items/item_reject'
      action='RUD'
    />
  );
};

export default ItemRejectTable;

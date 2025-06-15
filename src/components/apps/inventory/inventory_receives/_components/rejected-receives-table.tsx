import { useState } from 'react';

import { InventoryTypeLabel } from '@/components/apps/inventory/_components/inventory_type_label';
import ModalNewRetur from '@/components/apps/inventory/inventory_receives/_components/modal-new-retur';
import RenderDataTable from '@/components/commons/data-tables';

import { useGetAllReceives } from '@/app/api/hooks/inventory/receive/useCRUDReceive';
import { ItemReceiveState } from '@/helpers/utils/inventory/inventory_receive';

interface MyData {
  [key: string]: unknown;
}
interface IProps<T extends object> {
  data?: T[];
  refetch: () => void;
}

const RejectedReceivesTable = <T extends object>({
  data,
  refetch,
}: IProps<T>) => {
  const { isLoading, refetch: refetchReceive } = useGetAllReceives();

  const [modalForm, setModalForm] = useState(false);
  const [selectedPurchaseCode, setSelectedPkid] = useState<string>('');
  const [selectedItemReceives, setSelectedItemReceives] = useState<
    ItemReceiveState[]
  >([]);
  const handleSetModal = (isOpen: boolean) => {
    setModalForm(isOpen);
  };

  const onReturClick = (row: MyData) => {
    setSelectedPkid(row.activity_target as string);
    setSelectedItemReceives(row.ItemReceives as ItemReceiveState[]);
    handleSetModal(true);
  };

  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'date', title: 'Date' },
    {
      accessor: 'type',
      title: 'Type',
      render: (row: MyData) => (
        <InventoryTypeLabel type={row.type as 'purchase' | 'sales'} />
      ),
    },
    { accessor: 'activity_target', title: 'Activity' },
    {
      accessor: 'create',
      title: 'Create Retur',
      render: (row: MyData) => (
        <button className='btn btn-primary' onClick={() => onReturClick(row)}>
          Retur
        </button>
      ),
    },
    { accessor: 'action', title: 'Action' },
  ];

  return (
    <>
      <RenderDataTable
        title='Rejected Receives Table'
        data={data as MyData[]}
        columns={cols}
        isLoading={isLoading}
        refetch={refetch}
        hide_columns={['pkid', 'action']}
      />
      <ModalNewRetur
        modal={modalForm}
        purchaseCode={selectedPurchaseCode}
        itemReceives={selectedItemReceives}
        setModal={handleSetModal}
        refetch={refetchReceive}
      />
    </>
  );
};

export default RejectedReceivesTable;

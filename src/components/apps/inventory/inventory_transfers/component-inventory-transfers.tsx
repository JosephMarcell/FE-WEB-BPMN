'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalNewTransfer from '@/components/apps/inventory/inventory_transfers/_components/modal-new-transfers-item';
import TransfersTable from '@/components/apps/inventory/inventory_transfers/_components/transfers-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllInventoryTransferOnlyHeader } from '@/app/api/hooks/inventory/inventory_transfer/useGetAllInventoryTransferOnlyHeader';

const ComponentsInventoryTransfers = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {
    data: listTransfers,
    isLoading,
    refetch,
  } = useGetAllInventoryTransferOnlyHeader();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => dispatch(setModalForm(true))}
      >
        Add New Transfer
      </button>
      <ModalNewTransfer
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col sm:h-[calc(100vh_-_150px)]'>
        <TransfersTable
          data={listTransfers}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsInventoryTransfers;

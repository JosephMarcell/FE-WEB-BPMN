'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalNewReceiveItem from '@/components/apps/inventory/inventory_receives/_components/modal-new-receive-item';
import ReceivesTable from '@/components/apps/inventory/inventory_receives/_components/receives-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllInventoryReceiveOnlyHeader } from '@/app/api/hooks/inventory/inventory_receive/useGetAllInventoryReceiveOnlyHeader';

const ComponentsInventoryReceives = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const {
    data: listReceives,
    isLoading,
    refetch,
  } = useGetAllInventoryReceiveOnlyHeader();

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
      <div className='flex gap-2'>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => handleSetModal(true)}
        >
          Add New Receive
        </button>
      </div>
      <ModalNewReceiveItem
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />

      <div className='relative flex h-full flex-col gap-5'>
        <ReceivesTable
          data={listReceives}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsInventoryReceives;

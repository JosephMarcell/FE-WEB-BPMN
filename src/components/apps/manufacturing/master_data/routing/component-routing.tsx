'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalRouting from '@/components/apps/manufacturing/master_data/routing/_components/modal-routing';
import RoutingTable from '@/components/apps/manufacturing/master_data/routing/_components/routing-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetUniqueRoutingByItemPkid } from '@/app/api/hooks/manufacturing/routing/useGetUniqueRoutingByItemPkid';

const ComponentsRouting = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const {
    data: listRouting,
    isLoading,
    refetch,
  } = useGetUniqueRoutingByItemPkid();

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
        Add New Routing Item
      </button>
      <ModalRouting
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <RoutingTable
          data={listRouting}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsRouting;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ItemsTable from '@/components/apps/inventory/inventory_items/_components/items-table';
import ModalNewItem from '@/components/apps/inventory/inventory_items/_components/modal-new-item';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

import { useGetAllItems } from '@/app/api/hooks/inventory/items/useCRUDItem';
const ComponentsInventoryItems = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const { data: listItems, isLoading, refetch } = useGetAllItems();

  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => dispatch(setModalForm(true))}
      >
        Add New Item
      </button>
      <ModalNewItem
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col sm:h-[calc(100vh_-_150px)]'>
        <ItemsTable data={listItems} isLoading={isLoading} refetch={refetch} />
      </div>
    </div>
  );
};

export default ComponentsInventoryItems;

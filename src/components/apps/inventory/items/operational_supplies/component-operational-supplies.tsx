'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalOperationalSupplies from '@/components/apps/inventory/items/operational_supplies/_components/modal-operational-supplies';
import OperationalSuppliesTable from '@/components/apps/inventory/items/operational_supplies/_components/operational-supplies-tabel';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetItemByCategory } from '@/app/api/hooks/inventory/items/item/useGetItemByCategory';

const ComponentsOperationalSupplies = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listCategory, isLoading, refetch } = useGetItemByCategory(5);

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
        onClick={() => handleSetModal(true)}
      >
        Add New Operational Supplies
      </button>
      <ModalOperationalSupplies
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <OperationalSuppliesTable
          data={listCategory}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsOperationalSupplies;

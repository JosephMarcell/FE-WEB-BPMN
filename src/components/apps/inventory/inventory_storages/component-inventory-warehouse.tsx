'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import InventorWarehouseTable from '@/components/apps/inventory/inventory_storages/_components/inventory-warehouse-table';
import ModalInventoryWarehouse from '@/components/apps/inventory/inventory_storages/_components/modal-inventory-warehouse';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllInventoryWarehouse } from '@/app/api/hooks/inventory/inventory_warehouse/useGetAllInventoryWarehouse';

const ComponentsInventoryWarehouse = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const {
    data: listInventoryWarehouse,
    isLoading,
    refetch,
  } = useGetAllInventoryWarehouse();
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
          Add New Recieve
        </button>
      </div>
      <ModalInventoryWarehouse
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col sm:h-[calc(100vh_-_150px)]'>
        <InventorWarehouseTable
          data={listInventoryWarehouse}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsInventoryWarehouse;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalBillOfMaterial from '@/components/apps/inventory/other/bill_of_materials/_components/modal-bill-of-material';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllBillOfMaterialOnlyHeader } from '@/app/api/hooks/inventory/bill_of_material/useGetAllBillOfMaterialOnlyHeader';

import BillOfMaterialTable from './_components/bill-of-material-table';
const ComponentsBillOfMaterial = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const {
    data: listBillOfMaterial,
    isLoading,
    refetch,
  } = useGetAllBillOfMaterialOnlyHeader();

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
        New Bill Of Material
      </button>
      <ModalBillOfMaterial
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 '>
        <BillOfMaterialTable
          data={listBillOfMaterial}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsBillOfMaterial;

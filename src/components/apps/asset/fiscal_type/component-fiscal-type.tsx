'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import FiscalTypeTable from '@/components/apps/asset/fiscal_type/_components/fiscal-type-table';
import ModalFiscalType from '@/components/apps/asset/fiscal_type/_components/modal-fiscal-type';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllFiscalType } from '@/app/api/hooks/fixed_asset/fiscal_type/useGetAllFiscalType';

const ComponentsFiscalType = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: listFiscalType, isLoading, refetch } = useGetAllFiscalType();

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
        Add New Fiscal Type
      </button>
      <ModalFiscalType
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <FiscalTypeTable
          data={listFiscalType}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsFiscalType;

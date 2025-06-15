'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import InspectionProductTable from '@/components/apps/manufacturing/production/inspection_product/_components/inspection-product-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllInspectionProduct } from '@/app/api/hooks/manufacturing/inspection_product/useGetAllInspectionProduct';

import ModalInspectionProduct from './_components/modal-inspection-product';

const ComponentsInspectionProduct = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const {
    data: listInspectionProduct,
    isLoading,
    refetch,
  } = useGetAllInspectionProduct();

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
      <ModalInspectionProduct
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <InspectionProductTable
          data={listInspectionProduct}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsInspectionProduct;

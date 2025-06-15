'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalPurchaseRequest from '@/components/apps/purchasing/purchasing_request/_components/modal-purchase-request';
import PurchaseRequestTable from '@/components/apps/purchasing/purchasing_request/_components/purchase-request-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllPurchaseRequest } from '@/app/api/hooks/purchasing/purchase_request/useGetAllPurchaseRequest';
const ComponentsPurchasingRequest = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const {
    data: listPurchaseRequest,
    isLoading,
    refetch,
  } = useGetAllPurchaseRequest();
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
        Add New Purchase Request
      </button>
      <ModalPurchaseRequest
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col sm:h-[calc(100vh_-_150px)]'>
        <PurchaseRequestTable
          data={listPurchaseRequest}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsPurchasingRequest;

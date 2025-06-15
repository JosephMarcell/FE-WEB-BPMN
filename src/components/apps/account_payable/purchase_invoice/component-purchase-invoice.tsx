'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalCreatePurchaseInvoice from '@/components/apps/account_payable/purchase_invoice/_components/modal-create-purchase-invoice';
import ModalUpdatePurchaseInvoice from '@/components/apps/account_payable/purchase_invoice/_components/modal-update-purchase-invoice';
import PurchaseInvoiceTable from '@/components/apps/account_payable/purchase_invoice/_components/purchase-invoice-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVPurchaseInvoice } from '@/app/api/hooks/account_payable/purchase_invoice/useGenerateCSVPurchaseInvoice';
import { useGetAllPurchaseInvoice } from '@/app/api/hooks/account_payable/purchase_invoice/useGetAllPurchaseInvoice';

const ComponentsPurchaseInvoice = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: listPurchaseInvoice,
    isLoading,
    refetch,
  } = useGetAllPurchaseInvoice();
  const { generateCSV } = useGenerateCSVPurchaseInvoice();

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
        Create
      </button>
      <ModalCreatePurchaseInvoice
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdatePurchaseInvoice
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <PurchaseInvoiceTable
          data={listPurchaseInvoice}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentsPurchaseInvoice;

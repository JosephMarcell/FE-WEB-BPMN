'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalCreatePurchaseDownPaymentInvoice from '@/components/apps/account_payable/purchase_down_payment_invoice/_components/modal-create-purchase-down-payment-invoice';
import ModalUpdatePurchaseDownPaymentInvoice from '@/components/apps/account_payable/purchase_down_payment_invoice/_components/modal-update-purchase-down-payment-invoice';
import PurchaseDownPaymentInvoiceTable from '@/components/apps/account_payable/purchase_down_payment_invoice/_components/purchase-down-payment-invoice-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVPurchaseDownPaymentInvoice } from '@/app/api/hooks/account_payable/purchase_down_payment_invoice/useGenerateCSVPurchaseDownPaymentInvoice';
import { useGetAllPurchaseDownPaymentInvoice } from '@/app/api/hooks/account_payable/purchase_down_payment_invoice/useGetAllPurchaseDownPaymentInvoice';

const ComponentsPurchaseDownPaymentInvoice = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: listPurchaseDownPaymentInvoice,
    isLoading,
    refetch,
  } = useGetAllPurchaseDownPaymentInvoice();
  const { generateCSV } = useGenerateCSVPurchaseDownPaymentInvoice();

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
      <ModalCreatePurchaseDownPaymentInvoice
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdatePurchaseDownPaymentInvoice
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <PurchaseDownPaymentInvoiceTable
          data={listPurchaseDownPaymentInvoice}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentsPurchaseDownPaymentInvoice;

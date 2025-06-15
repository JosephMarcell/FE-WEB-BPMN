'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalCreateSalesDownPaymentInvoice from '@/components/apps/account_receivable/sales_down_payment_invoice/_components/modal-create-sales-down-payment-invoice';
import ModalUpdateSalesDownPaymentInvoice from '@/components/apps/account_receivable/sales_down_payment_invoice/_components/modal-update-sales-down-payment-invoice';
import SalesDownPaymentInvoiceTable from '@/components/apps/account_receivable/sales_down_payment_invoice/_components/sales-down-payment-invoice-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVSalesDownPaymentInvoice } from '@/app/api/hooks/account_receivable/sales_down_payment_invoice/useGenerateCSVSalesDownPaymentInvoice';
import { useGetAllSalesDownPaymentInvoice } from '@/app/api/hooks/account_receivable/sales_down_payment_invoice/useGetAllSalesDownPaymentInvoice';

const ComponentsSalesDownPaymentInvoice = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: listSalesDownPaymentInvoice,
    isLoading,
    refetch,
  } = useGetAllSalesDownPaymentInvoice();
  const { generateCSV } = useGenerateCSVSalesDownPaymentInvoice();

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
      <ModalCreateSalesDownPaymentInvoice
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateSalesDownPaymentInvoice
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <SalesDownPaymentInvoiceTable
          data={listSalesDownPaymentInvoice}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentsSalesDownPaymentInvoice;

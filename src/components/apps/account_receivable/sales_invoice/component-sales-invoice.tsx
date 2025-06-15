'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalCreateSalesInvoice from '@/components/apps/account_receivable/sales_invoice/_components/modal-create-sales-invoice';
import ModalUpdateSalesInvoice from '@/components/apps/account_receivable/sales_invoice/_components/modal-update-sales-invoice';
import SalesInvoiceTable from '@/components/apps/account_receivable/sales_invoice/_components/sales-invoice-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVSalesInvoice } from '@/app/api/hooks/account_receivable/sales_invoice/useGenerateCSVSalesInvoice';
import { useGetAllSalesInvoice } from '@/app/api/hooks/account_receivable/sales_invoice/useGetAllSalesInvoice';

const ComponentsSalesInvoice = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: listSalesInvoice,
    isLoading,
    refetch,
  } = useGetAllSalesInvoice();
  const { generateCSV } = useGenerateCSVSalesInvoice();

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
      <ModalCreateSalesInvoice
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateSalesInvoice
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <SalesInvoiceTable
          data={listSalesInvoice}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentsSalesInvoice;

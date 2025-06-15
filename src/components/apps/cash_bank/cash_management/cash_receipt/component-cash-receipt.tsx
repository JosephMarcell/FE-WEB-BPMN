'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CashReceiptTable from '@/components/apps/cash_bank/cash_management/cash_receipt/_components/cash-receipt-table';
import ModalCreateCashReceipt from '@/components/apps/cash_bank/cash_management/cash_receipt/_components/modal-create-cash-receipt';
import ModalUpdateCashReceipt from '@/components/apps/cash_bank/cash_management/cash_receipt/_components/modal-update-cash-receipt';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVCashReceipt } from '@/app/api/hooks/cash_bank/cash_receipt/useGenerateCSVCashReceipt';
import { useGetAllCashReceipt } from '@/app/api/hooks/cash_bank/cash_receipt/useGetAllCashReceipt';

const ComponentCashReceipt = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const { data: listCashReceipts, isLoading, refetch } = useGetAllCashReceipt();
  const { generateCSV } = useGenerateCSVCashReceipt();

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
      <ModalCreateCashReceipt
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateCashReceipt
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <CashReceiptTable
          data={listCashReceipts}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentCashReceipt;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BankReceiptTable from '@/components/apps/cash_bank/bank_management/bank_receipt/_components/bank-receipt-table';
import ModalCreateBankReceipt from '@/components/apps/cash_bank/bank_management/bank_receipt/_components/modal-create-bank-receipt';
import ModalUpdateBankReceipt from '@/components/apps/cash_bank/bank_management/bank_receipt/_components/modal-update-bank-receipt';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVBankReceipt } from '@/app/api/hooks/cash_bank/bank_receipt/useGenerateCSVBankReceipt';
import { useGetAllBankReceipt } from '@/app/api/hooks/cash_bank/bank_receipt/useGetAllBankReceipt';

const ComponentBankReceipt = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const { data: listBankReceipts, isLoading, refetch } = useGetAllBankReceipt();
  const { generateCSV } = useGenerateCSVBankReceipt();

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
      <ModalCreateBankReceipt
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateBankReceipt
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <BankReceiptTable
          data={listBankReceipts}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentBankReceipt;

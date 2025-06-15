'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BankDisbursementTable from '@/components/apps/cash_bank/bank_management/bank_disbursement/_components/bank-disbursement-table';
import ModalCreateBankDisbursement from '@/components/apps/cash_bank/bank_management/bank_disbursement/_components/modal-create-bank-disbursement';
import ModalUpdateBankDisbursement from '@/components/apps/cash_bank/bank_management/bank_disbursement/_components/modal-update-bank-disbursement';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVBankDisbursement } from '@/app/api/hooks/cash_bank/bank_disbursement/useGenerateCSVBankDisbursement';
import { useGetAllBankDisbursement } from '@/app/api/hooks/cash_bank/bank_disbursement/useGetAllBankDisbursement';

const ComponentBankDisbursement = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: listBankDisbursements,
    isLoading,
    refetch,
  } = useGetAllBankDisbursement();
  const { generateCSV } = useGenerateCSVBankDisbursement();

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
      <ModalCreateBankDisbursement
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateBankDisbursement
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <BankDisbursementTable
          data={listBankDisbursements}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentBankDisbursement;

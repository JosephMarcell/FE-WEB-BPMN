'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BankAccountTable from '@/components/apps/cash_bank/bank_management/bank_account/_components/bank-account-table';
import ModalCreateBankAccount from '@/components/apps/cash_bank/bank_management/bank_account/_components/modal-create-bank-account';
import ModalUpdateBankAccount from '@/components/apps/cash_bank/bank_management/bank_account/_components/modal-update-bank-account';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVBankAccount } from '@/app/api/hooks/cash_bank/bank_account/useGenerateCSVBankAccount';
import { useGetAllBankAccount } from '@/app/api/hooks/cash_bank/bank_account/useGetAllBankAccount';

const ComponentBankAccount = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const { data: listBankAccounts, isLoading, refetch } = useGetAllBankAccount();
  const { generateCSV } = useGenerateCSVBankAccount();

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
      <ModalCreateBankAccount
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateBankAccount
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <BankAccountTable
          data={listBankAccounts}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentBankAccount;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CashAccountTable from '@/components/apps/cash_bank/cash_management/cash_account/_components/cash-account-table';
import ModalCreateCashAccount from '@/components/apps/cash_bank/cash_management/cash_account/_components/modal-create-cash-account';
import ModalUpdateCashAccount from '@/components/apps/cash_bank/cash_management/cash_account/_components/modal-update-cash-account';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVCashAccount } from '@/app/api/hooks/cash_bank/cash_account/useGenerateCSVCashAccount';
import { useGetAllCashAccount } from '@/app/api/hooks/cash_bank/cash_account/useGetAllCashAccount';

const ComponentCashAccount = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const { data: listCashAccounts, isLoading, refetch } = useGetAllCashAccount();
  const { generateCSV } = useGenerateCSVCashAccount();

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
      <ModalCreateCashAccount
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateCashAccount
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <CashAccountTable
          data={listCashAccounts}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentCashAccount;

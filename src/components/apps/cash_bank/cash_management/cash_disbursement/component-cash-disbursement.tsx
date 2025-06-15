'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CashDisbursementTable from '@/components/apps/cash_bank/cash_management/cash_disbursement/_components/cash-disbursement-table';
import ModalCreateCashDisbursement from '@/components/apps/cash_bank/cash_management/cash_disbursement/_components/modal-create-cash-disbursement';
import ModalUpdateCashDisbursement from '@/components/apps/cash_bank/cash_management/cash_disbursement/_components/modal-update-cash-disbursement';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVCashDisbursement } from '@/app/api/hooks/cash_bank/cash_disbursement/useGenerateCSVCashDisbursement';
import { useGetAllCashDisbursement } from '@/app/api/hooks/cash_bank/cash_disbursement/useGetAllCashDisbursement';

const ComponentCashDisbursement = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: listCashDisbursements,
    isLoading,
    refetch,
  } = useGetAllCashDisbursement();
  const { generateCSV } = useGenerateCSVCashDisbursement();

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
      <ModalCreateCashDisbursement
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateCashDisbursement
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <CashDisbursementTable
          data={listCashDisbursements}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentCashDisbursement;

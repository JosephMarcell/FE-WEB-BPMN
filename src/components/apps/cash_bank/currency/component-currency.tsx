'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CurrencyTable from '@/components/apps/cash_bank/currency/_components/currency-table';
import ModalCreateCurrency from '@/components/apps/cash_bank/currency/_components/modal-create-currency';
import ModalUpdateCurrency from '@/components/apps/cash_bank/currency/_components/modal-update-currency';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGenerateCSVCurrency } from '@/app/api/hooks/cash_bank/currency/useGenerateCSVCurrency';
import { useGetAllCurrency } from '@/app/api/hooks/cash_bank/currency/useGetAllCurrency';

const ComponentsCurrency = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );

  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const { data: listCurrency, isLoading, refetch } = useGetAllCurrency();
  const { generateCSV } = useGenerateCSVCurrency();

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
      <ModalCreateCurrency
        modal={modalForm}
        setModal={handleSetModal}
        refetch={refetch}
      />
      <ModalUpdateCurrency
        modal={modalEdit}
        setModal={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <CurrencyTable
          data={listCurrency}
          isLoading={isLoading}
          refetch={refetch}
          exportCSV={generateCSV}
        />
      </div>
    </div>
  );
};

export default ComponentsCurrency;

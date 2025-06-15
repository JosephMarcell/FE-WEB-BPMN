'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalVariableSalaryTypes from '@/components/apps/hrm/payroll/variable_salary_types/_components/modal-variable-salary-types';
import VariableSalaryTypesTable from '@/components/apps/hrm/payroll/variable_salary_types/_components/variable-salary-types-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllVariableSalaryTypes } from '@/app/api/hooks/hrm/variable_salary_types/useGetAllVariableSalaryTypes';

const ComponentsVariableSalaryTypes = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const {
    data: listCategory,
    isLoading,
    refetch,
  } = useGetAllVariableSalaryTypes();
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      {listCategory?.headers['can_create'] === 'true' && (
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => dispatch(setModalForm(true))}
        >
          Add New Allowance Names
        </button>
      )}
      <ModalVariableSalaryTypes
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <VariableSalaryTypesTable
          data={listCategory?.data}
          permission={`
            ${listCategory?.headers.can_update === 'true' ? 'U' : ''}
            ${listCategory?.headers.can_delete === 'true' ? 'D' : ''}
          `}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsVariableSalaryTypes;

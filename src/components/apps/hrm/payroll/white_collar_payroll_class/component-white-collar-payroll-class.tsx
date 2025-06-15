'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalWhiteCollarPayrollClass from '@/components/apps/hrm/payroll/white_collar_payroll_class/_components/modal-white-collar-payroll-class';
import WhiteCollarPayrollClassTable from '@/components/apps/hrm/payroll/white_collar_payroll_class/_components/white-collar-payroll-class-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllWhiteCollarPayrollClass } from '@/app/api/hooks/hrm/white_collar_payroll_class/useGetAllWhiteCollarPayrollClass';

const ComponentsWhiteCollarPayrollClass = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const {
    data: listWhiteCollarPayrollClass,
    isLoading,
    refetch,
  } = useGetAllWhiteCollarPayrollClass();
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      {listWhiteCollarPayrollClass?.headers['can_create'] === 'true' && (
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => dispatch(setModalForm(true))}
        >
          Add New White Collar Salary Types
        </button>
      )}
      <ModalWhiteCollarPayrollClass
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <WhiteCollarPayrollClassTable
          data={listWhiteCollarPayrollClass?.data}
          permission={`
            R
            ${
              listWhiteCollarPayrollClass?.headers.can_update === 'true'
                ? 'U'
                : ''
            }
            ${
              listWhiteCollarPayrollClass?.headers.can_delete === 'true'
                ? 'D'
                : ''
            }
          `}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsWhiteCollarPayrollClass;

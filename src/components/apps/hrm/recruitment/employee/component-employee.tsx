'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import EmployeeTable from '@/components/apps/hrm/recruitment/employee/_components/employee-table';
import ModalEmployee from '@/components/apps/hrm/recruitment/employee/_components/modal-employee';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllEmployee } from '@/app/api/hooks/hrm/employee/useGetAllEmployee';

const ComponentsEmployee = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const { data: listCategory, isLoading, refetch } = useGetAllEmployee();
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
          Add New Employee
        </button>
      )}
      <ModalEmployee
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <EmployeeTable
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

export default ComponentsEmployee;

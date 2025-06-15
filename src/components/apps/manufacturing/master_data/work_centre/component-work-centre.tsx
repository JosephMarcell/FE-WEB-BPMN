'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalWorkCentre from '@/components/apps/manufacturing/master_data/work_centre/_components/modal-work-centre';
import WorkCentreTable from '@/components/apps/manufacturing/master_data/work_centre/_components/work-centre-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllWorkCentre } from '@/app/api/hooks/manufacturing/work_centre/useGetAllWorkCentre';

const ComponentsWorkCentre = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
  const { data: listWorkcentre, isLoading, refetch } = useGetAllWorkCentre();

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
        Add New Work Centre
      </button>
      <ModalWorkCentre
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <WorkCentreTable
          data={listWorkcentre}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsWorkCentre;

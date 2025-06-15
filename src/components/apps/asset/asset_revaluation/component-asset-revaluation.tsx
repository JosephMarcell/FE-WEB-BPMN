'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalAssetRevaluation from '@/components/apps/asset/asset_revaluation/_components/modal-revaluation-asset';
import RevaluationTable from '@/components/apps/asset/asset_revaluation/_components/revaluation-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAssetRevaluation } from '@/app/api/hooks/fixed_asset/asset_revaluation/useGetAllAssetRevaluation';

const ComponentsAssetRevaluation = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const {
    data: listRevaluation,
    isLoading,
    refetch,
  } = useGetAllAssetRevaluation();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );
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
        Add New Revaluation
      </button>
      <ModalAssetRevaluation
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <RevaluationTable
          data={listRevaluation}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsAssetRevaluation;

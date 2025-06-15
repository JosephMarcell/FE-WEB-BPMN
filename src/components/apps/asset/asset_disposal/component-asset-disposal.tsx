'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import DisposalTable from '@/components/apps/asset/asset_disposal/_components/disposal-table';
import ModalAssetDisposal from '@/components/apps/asset/asset_disposal/_components/modal-disposal-asset';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAssetDisposal } from '@/app/api/hooks/fixed_asset/asset_disposal/useGetAllAssetDisposal';

const ComponentsAssetDisposal = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: listDisposal, isLoading, refetch } = useGetAllAssetDisposal();

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
        Add New Disposal
      </button>
      <ModalAssetDisposal
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <DisposalTable
          data={listDisposal}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsAssetDisposal;

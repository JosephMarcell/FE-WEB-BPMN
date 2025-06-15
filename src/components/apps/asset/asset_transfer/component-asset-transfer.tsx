'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalAssetTransfer from '@/components/apps/asset/asset_transfer/_components/modal-transfer-asset';
import TransferTable from '@/components/apps/asset/asset_transfer/_components/transfer-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAssetTransfer } from '@/app/api/hooks/fixed_asset/asset_transfer/useGetAllAssetTransfer';

const ComponentsAssetTransfer = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: listTransfer, isLoading, refetch } = useGetAllAssetTransfer();
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
        Add New Transfer
      </button>
      <ModalAssetTransfer
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <TransferTable
          data={listTransfer}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsAssetTransfer;

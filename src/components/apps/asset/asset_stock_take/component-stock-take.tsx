'use client';

import { usePathname } from 'next/navigation';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalAssetStockTake from '@/components/apps/asset/asset_stock_take/_components/modal-stock-take-asset';
import StockTakeTable from '@/components/apps/asset/asset_stock_take/_components/stock-take-table';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAssetStockTake } from '@/app/api/hooks/fixed_asset/asset_stock_take/useGetAllAssetStockTake';

const ComponentsAssetStockTake = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const { data: listStockTake, isLoading, refetch } = useGetAllAssetStockTake();

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
        Add New Stock Take
      </button>
      <ModalAssetStockTake
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <StockTakeTable
          data={listStockTake}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsAssetStockTake;

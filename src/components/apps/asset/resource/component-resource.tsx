'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalResource from '@/components/apps/asset/resource/_components/modal-resource';
import RenderDataTable from '@/components/commons/data-tables';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

import { useGetAllResource } from '@/app/api/hooks/fixed_asset/resource/useGetAllResource';
import { useSoftDeleteResource } from '@/app/api/hooks/fixed_asset/resource/useSoftDeleteResource';

const { t } = getTranslation();

const ComponentsResource = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };

  const [page, setPage] = useState(1); // Track current page
  const [limit, setLimit] = useState(10); // Track current limit
  const {
    data: listResource,
    isLoading,
    // error,
  } = useGetAllResource(page, limit);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { mutateAsync: deleteResource } = useSoftDeleteResource();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'asset_code', title: t('asset_code') },
    { accessor: 'resource_name', title: t('resource_name') },
    { accessor: 'office_name', title: t('office_name') },
    { accessor: 'description', title: t('description') },
    { accessor: 'action', title: t('action') },
  ];

  const [modalEdit, setModalEdit] = useState(false);
  const refetch = () => {
    // Define the refetch function logic here
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='flex flex-row gap-4'>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => dispatch(setModalForm(true))}
        >
          {t('add')} {t('resources')}
        </button>
      </div>

      <ModalResource
        modal={modalForm}
        setModal={handleSetModal}
        modalEdit={modalEdit}
        setModalEdit={setModalEdit}
        refetch={refetch}
      />

      <div className='relative flex h-full flex-col gap-5'>
        <RenderDataTable
          title={t('resources')}
          data={listResource?.data}
          columns={cols}
          isLoading={isLoading}
          detailPath='/assets/resource'
          action='RUD'
          refetch={refetch}
          deleteFunc={deleteResource}
          pagination={listResource?.pagination} // Pass pagination to RenderDataTable
          setPage={handlePageChange} // Pass setPage to RenderDataTable
          setLimit={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ComponentsResource;

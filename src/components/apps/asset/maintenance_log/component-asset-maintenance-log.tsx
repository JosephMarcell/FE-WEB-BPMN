'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalAssetMaintenance from '@/components/apps/asset/maintenance_log/_components/modal-maintenance-asset-log';
import RenderDataTable from '@/components/commons/data-tables';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAssetMaintenance } from '@/app/api/hooks/fixed_asset/maintenance_log/useGetAllAssetMaintenanceLog';
import { useSoftDeleteAssetMaintenanceLog } from '@/app/api/hooks/fixed_asset/maintenance_log/useSoftDeleteAssetMaintenanceLog';
const { t } = getTranslation();

const ComponentsAssetMaintenance = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const [page, setPage] = useState(1); // Track current page
  const [limit, setLimit] = useState(10); // Track items per page

  const {
    data: listMaintenance,
    isLoading,
    refetch,
  } = useGetAllAssetMaintenance({ page, per_page: limit });

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

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  const { mutateAsync: deleteAssetMaintenanceLog } =
    useSoftDeleteAssetMaintenanceLog();

  const cols = [
    { accessor: 'pkid', title: t('maintenance_id') },
    { accessor: 'model_name', title: t('model_name') },
    { accessor: 'model_type', title: t('model_type') },
    { accessor: 'user_name', title: t('user_name') },
    {
      accessor: 'maintenance_start',
      title: t('maintenance_start_date') + '(DD-MM-YYYY)',
    },
    {
      accessor: 'maintenance_end',
      title: t('maintenance_end_date') + '(DD-MM-YYYY)',
    },
    { accessor: 'maintenance_type', title: t('maintenance_type') },
    { accessor: 'status', title: 'Status' },
    { accessor: 'office_name', title: t('office_name') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <ModalAssetMaintenance
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <RenderDataTable
          title={t('maintenance_log')}
          data={listMaintenance?.data || []}
          columns={cols}
          isLoading={isLoading}
          detailPath='/assets/maintenance_log'
          action='EDLR'
          deleteFunc={deleteAssetMaintenanceLog}
          refetch={refetch}
          pagination={listMaintenance?.pagination}
          setPage={handlePageChange}
          setLimit={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ComponentsAssetMaintenance;

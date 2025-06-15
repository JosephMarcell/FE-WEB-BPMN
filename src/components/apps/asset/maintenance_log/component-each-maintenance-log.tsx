'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';
import { FaArrowLeft } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import EachMaintenanceLogTable from '@/components/apps/asset/maintenance_log/_components/maintenance-each-log-table';
import ModalAssetMaintenance from '@/components/apps/asset/maintenance_log/_components/modal-maintenance-asset-log';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllAssetMaintenanceEach } from '@/app/api/hooks/fixed_asset/maintenance_log/useGetAllAssetMaintenanceId';

const { t } = getTranslation();
interface AssetMaintenancePkid {
  pkid: number;
}

const ComponentsEachAssetMaintenanceLog = ({ pkid }: AssetMaintenancePkid) => {
  const pathname = usePathname();
  const dispatch = useDispatch();

  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const modalEdit = useSelector(
    (state: IRootState) => state.themeConfig.modalEdit,
  );

  const {
    data: logList,
    isLoading,
    refetch,
  } = useGetAllAssetMaintenanceEach(pkid, 1, 10);

  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };
  const handleSetModalEdit = (isOpen: boolean) => {
    dispatch(setModalEdit(isOpen));
  };

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='flex flex-row justify-between'>
        <button
          type='button'
          className='btn btn-primary'
          onClick={() => dispatch(setModalForm(true))}
        >
          {t('add_new')} {t('maintenance_log')}
        </button>
        <Link
          href='../maintenance_log'
          className='btn btn-outline-primary gap-1'
        >
          <FaArrowLeft /> {t('back')}
        </Link>
      </div>

      <ModalAssetMaintenance
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <EachMaintenanceLogTable
          data={logList?.data}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsEachAssetMaintenanceLog;

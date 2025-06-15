'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalListAsset from '@/components/apps/asset/asset_list/_components/modal-list-asset';
import RenderDataTable from '@/components/commons/data-tables';
import MultivalueDropdown from '@/components/multivalue-dropdown';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

import { useGetAssetByFilter } from '@/app/api/hooks/fixed_asset/asset_list/useGetByFilter';
import { useSoftDeleteAsset } from '@/app/api/hooks/fixed_asset/asset_list/useSoftDeleteAsset';
import {
  AssetCondition,
  assetTypeOptions,
} from '@/helpers/utils/global/listStatus';

const { t } = getTranslation();

const AssetStatus = [
  { value: 'aktif', label: t('active'), color: 'success' },
  { value: 'tidak_layak', label: t('unfit_for_use'), color: 'danger' },
  {
    value: 'menunggu_perbaikan',
    label: t('awaiting_repair'),
    color: 'warning',
  },
  { value: 'dalam_perbaikan', label: t('under_repair'), color: 'black' },
];

const ComponentsAsset = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const modalForm = useSelector(
    (state: IRootState) => state.themeConfig.modalForm,
  );
  const handleSetModal = (isOpen: boolean) => {
    dispatch(setModalForm(isOpen));
  };

  const [filters, setFilters] = useState({
    status: undefined as string[] | undefined,
    condition: undefined as string[] | undefined,
    asset_type: undefined as string[] | undefined,
  });

  const [page, setPage] = useState(1); // Track current page
  const [limit, setLimit] = useState(10); // Track current limit
  const {
    data: listAsset,
    isLoading,
    // error,
  } = useGetAssetByFilter(
    { ...filters, page, per_page: limit }, // Pass page and limit to the hook
  );

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const { mutateAsync: deleteAsset } = useSoftDeleteAsset();
  const cols = [
    { accessor: 'asset_code', title: 'Asset ID' },
    { accessor: 'asset_type', title: 'Tipe' },
    { accessor: 'office_name', title: 'Kantor' },
    {
      accessor: 'last_usage',
      title: 'Pemakaian Terakhir (DD-MM-YYYY HH:MM:SS)',
    },
    { accessor: 'status', title: 'Status' },
    { accessor: 'purchase_date', title: 'Tanggal Pembelian (DD-MM-YYYY)' },
    { accessor: 'condition', title: 'Kondisi' },
    { accessor: 'action', title: 'Aksi' },
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
          {t('add_new_asset')}
        </button>
        <div className='flex flex-row gap-4'>
          <MultivalueDropdown
            options={assetTypeOptions}
            placeholder={t('select_asset_type')}
            selectedValues={filters.asset_type || []}
            onChange={values =>
              updateFilters({ asset_type: values.length ? values : undefined })
            }
          />
          <MultivalueDropdown
            options={AssetStatus}
            placeholder={t('select_asset_status')}
            selectedValues={filters.status || []}
            onChange={values =>
              updateFilters({ status: values.length ? values : undefined })
            }
          />
          <MultivalueDropdown
            options={AssetCondition}
            placeholder={t('select_asset_condition')}
            selectedValues={filters.condition || []}
            onChange={values =>
              updateFilters({ condition: values.length ? values : undefined })
            }
          />
        </div>
      </div>

      <ModalListAsset
        modal={modalForm}
        setModal={handleSetModal}
        modalEdit={modalEdit}
        setModalEdit={setModalEdit}
        refetch={refetch}
      />

      <div className='relative flex h-full flex-col gap-5'>
        <RenderDataTable
          title={t('asset_list')}
          data={listAsset?.data}
          columns={cols}
          isLoading={isLoading}
          detailPath='/assets/asset_list/'
          action='RUDL'
          refetch={() => {
            // Refetch data when needed
          }}
          deleteFunc={deleteAsset}
          pagination={listAsset?.pagination} // Pass pagination to RenderDataTable
          setPage={handlePageChange} // Pass setPage to RenderDataTable
          setLimit={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ComponentsAsset;

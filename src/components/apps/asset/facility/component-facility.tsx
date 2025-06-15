'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ModalFacility from '@/components/apps/asset/facility/_components/modal-facility';
import RenderDataTable from '@/components/commons/data-tables';

import { IRootState } from '@/store';
import { setModalEdit, setModalForm } from '@/store/themeConfigSlice';

import { useGetAllFacility } from '@/app/api/hooks/fixed_asset/facility/useGetAllFacility';
import { useSoftDeleteFacility } from '@/app/api/hooks/fixed_asset/facility/useSoftDeleteFacility';

const { t } = getTranslation();

const ComponentsFacility = () => {
  const pathname = usePathname();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1); // Track current page
  const [limit, setLimit] = useState(10); // Track current limit

  const {
    data: listFacility,
    isLoading,
    refetch,
  } = useGetAllFacility(page, limit);

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

  const cols = [
    { accessor: 'pkid', title: t('facility_id') },
    { accessor: 'facility_name', title: t('facility_name') },
    {
      accessor: 'last_usage',
      title: t('last_usage') + ' (DD-MM-YYYY HH:MM:SS)',
    },
    { accessor: 'condition', title: t('condition') },
    { accessor: 'status', title: t('status') },
    { accessor: 'description', title: t('description') },
    { accessor: 'office_name', title: t('office_name') },
    { accessor: 'action', title: t('action') },
  ];

  const { mutateAsync: deleteFacility } = useSoftDeleteFacility();

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1);
  };

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <button
        type='button'
        className='btn btn-primary'
        onClick={() => dispatch(setModalForm(true))}
      >
        {t('add_new')} {t('facility')}
      </button>
      <ModalFacility
        modal={modalForm}
        modalEdit={modalEdit}
        setModal={handleSetModal}
        setModalEdit={handleSetModalEdit}
        refetch={refetch}
      />
      <div className='relative flex h-full flex-col gap-5'>
        <RenderDataTable
          title={t('facility')}
          data={listFacility?.data || []}
          columns={cols}
          isLoading={isLoading}
          detailPath='/assets/facility/'
          deleteFunc={deleteFacility}
          action='RUD'
          refetch={refetch}
          pagination={listFacility?.pagination} // Pass pagination to RenderDataTable
          setPage={handlePageChange} // Pass setPage to RenderDataTable
          setLimit={handlePageSizeChange} // Pass setLimit to RenderDataTable
        />
      </div>
    </div>
  );
};

export default ComponentsFacility;

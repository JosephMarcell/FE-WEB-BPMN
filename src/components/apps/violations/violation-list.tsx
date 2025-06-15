'use client';

import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import CreateModals from '@/components/apps/violations/components/modal-create';
import RenderDataTable from '@/components/commons/data-tables';
import MultivalueDropdown from '@/components/multivalue-dropdown';

import { IRootState } from '@/store';
import { setModalForm } from '@/store/themeConfigSlice';

import { useGetViolationsbyFilter } from '@/app/api/hooks/violations/useGetViolationsbyFilter';
import { useSoftDeleteViolation } from '@/app/api/hooks/violations/useSoftDeleteViolation';
import {
  ViolationSeverityFiter,
  ViolationStatusFiter,
} from '@/helpers/utils/violations/violation';

const { t } = getTranslation();

const ViolationList = () => {
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
    severity: undefined as string[] | undefined,
    start_date: undefined as string | undefined, // Add start_date
    end_date: undefined as string | undefined, // Add end_date
  });

  const [page, setPage] = useState(1); // Track current page
  const [limit, setLimit] = useState(10); // Track current limit
  const {
    data: violationFilter,
    isLoading,
    // error,
  } = useGetViolationsbyFilter(
    { ...filters, page, per_page: limit }, // Pass page and limit to the hook
  );

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    setPage(1); // Reset to first page when filters change
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handlePageSizeChange = (newLimit: number) => {
    setLimit(newLimit);
    setPage(1); // Reset to first page when limit change
  };

  const { mutateAsync: deleteViolations } = useSoftDeleteViolation();
  const cols = [
    { accessor: 'pkid', title: 'ID' },
    { accessor: 'report_title', title: t('report_title') },
    { accessor: 'reported_at', title: t('reported_at') },
    { accessor: 'status', title: t('status') },
    { accessor: 'severity', title: t('severity') },
    { accessor: 'violation_type', title: t('violation_type') },
    { accessor: 'description', title: t('description') },
    { accessor: 'action', title: t('action') },
  ];

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='flex flex-row gap-4'>
        <div className='my-auto flex flex-col items-center'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => dispatch(setModalForm(true))}
          >
            {t('add')} {t('violations')}
          </button>
        </div>

        <div className='flex flex-col'>
          <label className='ml-4'>
            {' '}
            {t('choose')} {t('status')}{' '}
          </label>
          <MultivalueDropdown
            options={ViolationStatusFiter}
            placeholder={t('choose') + ' ' + t('status')}
            selectedValues={filters.status || []}
            onChange={values =>
              updateFilters({ status: values.length ? values : undefined })
            }
          />
        </div>
        <div className='flex flex-col'>
          <label className='ml-4'>
            {' '}
            {t('choose')} {t('severity')}{' '}
          </label>
          <MultivalueDropdown
            options={ViolationSeverityFiter}
            placeholder={t('choose') + ' ' + t('severity')}
            selectedValues={filters.severity || []}
            onChange={values =>
              updateFilters({ severity: values.length ? values : undefined })
            }
          />
        </div>
        <div className='flex flex-col'>
          <label className='ml-4' htmlFor='start_date'>
            {' '}
            {t('start_date')}{' '}
          </label>
          <input
            type='date'
            id='start_date'
            className='form-input'
            placeholder={t('start_date')}
            value={filters.start_date || ''}
            onChange={e =>
              updateFilters({ start_date: e.target.value || undefined })
            }
          />
        </div>
        <div className='flex flex-col'>
          <label className='ml-4' htmlFor='end_date'>
            {' '}
            {t('end_date')}{' '}
          </label>
          <input
            type='date'
            id='end_date'
            className='form-input'
            placeholder={t('end_date')}
            value={filters.end_date || ''}
            onChange={e =>
              updateFilters({ end_date: e.target.value || undefined })
            }
          />
        </div>
      </div>

      <CreateModals modal={modalForm} setModal={handleSetModal} />

      <div className='relative flex h-full flex-col gap-5'>
        <RenderDataTable
          title={t('violations')}
          data={violationFilter?.data}
          columns={cols}
          isLoading={isLoading}
          detailPath='/violations'
          action='RD'
          refetch={() => {
            // Refetch data when needed
          }}
          deleteFunc={deleteViolations}
          pagination={violationFilter?.pagination} // Pass pagination to ViolationTable
          setPage={handlePageChange} // Pass setPage to RenderDataTable
          setLimit={handlePageSizeChange}
        />
      </div>
    </div>
  );
};

export default ViolationList;

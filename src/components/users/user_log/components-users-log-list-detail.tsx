'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { FaArrowLeft } from 'react-icons/fa';

import { getTranslation } from '@/lib/lang/i18n';
import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import MultivalueDropdown from '@/components/multivalue-dropdown';
import EachUserActivityTable from '@/components/users/user_log/_components/each-user-activity-table';

import { useGetFilterActivityLog } from '@/app/api/hooks/user_management/user_log/useGetFilterActivityLog';

const { t } = getTranslation();

const ActionTypes = [
  { value: 'Register', label: 'REGISTER' },
  { value: 'Login', label: 'LOGIN' },
  { value: 'Update', label: 'UPDATE' },
  { value: 'Delete', label: 'DELETE' },
];

interface UserID {
  username: string;
}

const ComponentEachActivityLog = ({ username }: UserID) => {
  const pathname = usePathname();
  const storedUsername =
    typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  const [filters, setFilters] = useState({
    username: storedUsername
      ? [storedUsername]
      : ([username] as string[] | undefined),
    action_type: [] as string[] | undefined,
    actual_date: '',
    start_date: '',
    end_date: '',
  });

  const {
    data: logList,
    isLoading,
    refetch,
  } = useGetFilterActivityLog(filters);

  const updateFilters = (newFilters: Partial<typeof filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    refetch();
  };

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='flex flex-row justify-end'>
        <Link href='../user_log' className='btn btn-outline-primary gap-1'>
          <FaArrowLeft /> {t('back')}
        </Link>
      </div>

      <div className='z-10 flex flex-row gap-4'>
        <div>
          <label>{t('select_action_type')}</label>
          <MultivalueDropdown
            options={ActionTypes}
            placeholder={t('select_filters')}
            selectedValues={filters.action_type || []}
            onChange={values =>
              updateFilters({ action_type: values.length ? values : undefined })
            }
          />
        </div>

        <div>
          <label htmlFor='start_date'>{t('start_date')}</label>
          <input
            type='date'
            id='start_date'
            className='form-input w-full'
            placeholder={t('start_date')}
            value={filters.start_date}
            onChange={e => updateFilters({ start_date: e.target.value })}
          />
        </div>
        <div>
          <label htmlFor='end_date'>{t('end_date')}</label>
          <input
            type='date'
            id='end_date'
            className='form-input w-full'
            placeholder={t('end_date')}
            value={filters.end_date}
            onChange={e => updateFilters({ end_date: e.target.value })}
          />
        </div>
      </div>

      <div className='relative flex h-full flex-col gap-5'>
        <EachUserActivityTable
          data={logList?.data}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentEachActivityLog;

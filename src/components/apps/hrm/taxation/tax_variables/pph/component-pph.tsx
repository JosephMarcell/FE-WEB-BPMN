'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PPHTable from '@/components/apps/hrm/taxation/tax_variables/pph/_components/pph-table';

import { useGetCategoryPPH } from '@/app/api/hooks/hrm/tax_variables/pph/useGetAllPPH';

const ComponentsPPH = () => {
  const pathname = usePathname();
  const { data: listCategory, isLoading, refetch } = useGetCategoryPPH();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <PPHTable data={listCategory} isLoading={isLoading} refetch={refetch} />
      </div>
    </div>
  );
};

export default ComponentsPPH;

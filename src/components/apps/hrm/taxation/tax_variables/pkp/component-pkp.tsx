'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PKPTable from '@/components/apps/hrm/taxation/tax_variables/pkp/_components/pkp-table';

import { useGetAllPKP } from '@/app/api/hooks/hrm/tax_variables/pkp/useGetAllPKP';

const ComponentsPKP = () => {
  const pathname = usePathname();
  const { data: listCategory, isLoading, refetch } = useGetAllPKP();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />

      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <PKPTable data={listCategory} isLoading={isLoading} refetch={refetch} />
      </div>
    </div>
  );
};

export default ComponentsPKP;

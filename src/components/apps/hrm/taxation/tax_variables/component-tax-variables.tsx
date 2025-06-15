'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import TaxVariables from '@/components/apps/hrm/taxation/tax_variables/_components/tax-variables';

const ComponentsPayroll = () => {
  const pathname = usePathname();

  return (
    <div className='mb-5 space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <TaxVariables />
      </div>
    </div>
  );
};

export default ComponentsPayroll;

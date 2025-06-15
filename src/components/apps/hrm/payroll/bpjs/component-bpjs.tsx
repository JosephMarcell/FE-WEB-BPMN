'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BPJSForm from '@/components/apps/hrm/payroll/bpjs/_components/bpjs-form';

const ComponentsBpjs = () => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <BPJSForm />
    </div>
  );
};

export default ComponentsBpjs;

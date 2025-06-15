'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PayrollCalculator from '@/components/apps/hrm/payroll/payroll_calculator/_components/payroll-calculator-form';

const ComponentsPayrollCalculator = () => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <PayrollCalculator />
    </div>
  );
};

export default ComponentsPayrollCalculator;

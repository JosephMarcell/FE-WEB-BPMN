'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import BlueCollarSalarySlip from '@/components/apps/hrm/payroll/blue_collar_salary_slip/_components/blue_collar_salary_slip';

interface IBlueCollarSalarySlipDetail {
  pkid: number;
}
const ComponentsBlueCollarSalarySlipDetail = ({
  pkid,
}: IBlueCollarSalarySlipDetail) => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <BlueCollarSalarySlip pkid={pkid} />
    </div>
  );
};

export default ComponentsBlueCollarSalarySlipDetail;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import WhiteCollarSalarySlip from '@/components/apps/hrm/payroll/white_collar_salary_slip/_components/white_collar_salary_slip';

interface IWhiteCollarSalarySlipDetail {
  pkid: number;
}
const ComponentsWhiteCollarSalarySlipDetail = ({
  pkid,
}: IWhiteCollarSalarySlipDetail) => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <WhiteCollarSalarySlip pkid={pkid} />
    </div>
  );
};

export default ComponentsWhiteCollarSalarySlipDetail;

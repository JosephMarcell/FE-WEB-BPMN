import { Metadata } from 'next';
import React from 'react';

import ComponentsWhiteCollarSalarySlipDetail from '@/components/apps/hrm/payroll/white_collar_salary_slip/component-white-collar-salary-slip-detail';

export const metadata: Metadata = {
  title: 'White Collar Salary Slip',
};
const WhiteCollarSalarySlipDetail = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentsWhiteCollarSalarySlipDetail pkid={params.pkid} />;
};

export default WhiteCollarSalarySlipDetail;

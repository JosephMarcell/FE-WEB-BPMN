import { Metadata } from 'next';
import React from 'react';

import ComponentsBlueCollarSalarySlipDetail from '@/components/apps/hrm/payroll/blue_collar_salary_slip/component-blue-collar-salary-slip-detail';

export const metadata: Metadata = {
  title: 'Blue Collar Payroll Class',
};
const BlueCollarPayrollClassPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentsBlueCollarSalarySlipDetail pkid={params.pkid} />;
};

export default BlueCollarPayrollClassPage;

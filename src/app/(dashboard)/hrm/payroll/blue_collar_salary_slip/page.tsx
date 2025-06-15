import { Metadata } from 'next';
import React from 'react';

import ComponentBlueCollarSalarySlip from '@/components/apps/hrm/payroll/blue_collar_salary_slip/component-blue-collar-salary-slip';

export const metadata: Metadata = {
  title: 'Blue Collar Withold Certificate',
};

const BlueCollarSalarySlipPage = () => {
  return <ComponentBlueCollarSalarySlip />;
};

export default BlueCollarSalarySlipPage;

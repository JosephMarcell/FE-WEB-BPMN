import { Metadata } from 'next';
import React from 'react';

import ComponentWhiteCollarSalarySlip from '@/components/apps/hrm/payroll/white_collar_salary_slip/component-white-collar-salary-slip';

export const metadata: Metadata = {
  title: 'White Collar Salary Slip',
};

const WhiteCollarSalarySlipPage = () => {
  return <ComponentWhiteCollarSalarySlip />;
};

export default WhiteCollarSalarySlipPage;

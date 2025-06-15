import { Metadata } from 'next';
import React from 'react';

import ComponentWhiteCollarPayrollClass from '@/components/apps/hrm/payroll/white_collar_payroll_class/component-white-collar-payroll-class';

export const metadata: Metadata = {
  title: 'White Collar Payroll Class',
};

const WhiteCollarPayrollClassPage = () => {
  return <ComponentWhiteCollarPayrollClass />;
};

export default WhiteCollarPayrollClassPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentsPayrollCalculatorResult from '@/components/apps/hrm/payroll/payroll_calculator/component-payroll-calculator-result';

export const metadata: Metadata = {
  title: 'Payroll Calculator',
};

const PayrollCalculatorPage = () => {
  return <ComponentsPayrollCalculatorResult />;
};

export default PayrollCalculatorPage;

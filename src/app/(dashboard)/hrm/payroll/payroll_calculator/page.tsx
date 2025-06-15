import { Metadata } from 'next';
import React from 'react';

import ComponentPayrollCalculator from '@/components/apps/hrm/payroll/payroll_calculator/component-payroll-calculator';

export const metadata: Metadata = {
  title: 'Payroll Calculator',
};

const PayrollCalculatorPage = () => {
  return <ComponentPayrollCalculator />;
};

export default PayrollCalculatorPage;

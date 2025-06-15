import { Metadata } from 'next';
import React from 'react';

import ComponentWhiteCollarPayrollClassDetail from '@/components/apps/hrm/payroll/white_collar_payroll_class/component-white-collar-payroll-class-detail';

export const metadata: Metadata = {
  title: 'White Collar Payroll Class',
};
const WhiteCollarPayrollClassPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentWhiteCollarPayrollClassDetail pkid={params.pkid} />;
};

export default WhiteCollarPayrollClassPage;

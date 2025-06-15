import { Metadata } from 'next';
import React from 'react';

import ComponentEmployee from '@/components/apps/hrm/recruitment/employee/component-employee';

export const metadata: Metadata = {
  title: 'Employee',
};

const EmployeePage = () => {
  return <ComponentEmployee />;
};

export default EmployeePage;

import { Metadata } from 'next';
import React from 'react';

import ComponentDepartment from '@/components/apps/hrm/information_management/department/component-department';

export const metadata: Metadata = {
  title: 'Department',
};

const DepartmentPage = () => {
  return <ComponentDepartment />;
};

export default DepartmentPage;

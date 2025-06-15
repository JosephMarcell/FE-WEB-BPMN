import { Metadata } from 'next';
import React from 'react';

import ComponentDepartmentDetail from '@/components/apps/hrm/information_management/department/component-department-detail';

export const metadata: Metadata = {
  title: 'Department',
};
const DepartmentDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentDepartmentDetail pkid={params.pkid} />;
};

export default DepartmentDetailPage;

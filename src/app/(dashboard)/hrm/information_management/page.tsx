import { Metadata } from 'next';
import React from 'react';

import ComponentsHRMMenu from '@/components/apps/hrm/hrm_menu/component-hrm-menu';

export const metadata: Metadata = {
  title: 'Human Resource Management',
};

const InformationManagementPage = () => {
  return <ComponentsHRMMenu sub_menu='Information Management' />;
};

export default InformationManagementPage;

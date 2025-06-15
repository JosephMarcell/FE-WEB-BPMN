import { Metadata } from 'next';
import React from 'react';

import ComponentsHRMMenu from '@/components/apps/hrm/hrm_menu/component-hrm-menu';

export const metadata: Metadata = {
  title: 'Others',
};

const OthersPage = () => {
  return <ComponentsHRMMenu sub_menu='Others' />;
};

export default OthersPage;

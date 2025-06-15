import { Metadata } from 'next';
import React from 'react';

import ComponentsHRMMenu from '@/components/apps/hrm/hrm_menu/component-hrm-menu';

export const metadata: Metadata = {
  title: 'Recruitment Request',
};

const TaxationPage = () => {
  return <ComponentsHRMMenu sub_menu='Taxation' />;
};

export default TaxationPage;

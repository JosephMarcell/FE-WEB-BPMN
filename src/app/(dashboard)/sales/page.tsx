import { Metadata } from 'next';
import React from 'react';

import ComponentsSalesMenu from '@/components/apps/sales/sales_menu/component-sales-menu';

export const metadata: Metadata = {
  title: 'Sales Menu',
};

const SalesMenuPage = () => {
  return <ComponentsSalesMenu />;
};

export default SalesMenuPage;

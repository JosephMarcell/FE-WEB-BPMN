import { Metadata } from 'next';
import React from 'react';

import ComponentsSalesOrder from '@/components/apps/sales/sales_order/component-sales-order';

export const metadata: Metadata = {
  title: 'Sales Order',
};

const SalesOrderPage = () => {
  return <ComponentsSalesOrder />;
};

export default SalesOrderPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentSalesOrderDetail from '@/components/apps/sales/sales_order/component-sales-order-detail';

export const metadata: Metadata = {
  title: 'Supplier',
};
const SalesOrderDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentSalesOrderDetail pkid={params.pkid} />;
};

export default SalesOrderDetailPage;

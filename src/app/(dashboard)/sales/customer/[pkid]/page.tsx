import { Metadata } from 'next';
import React from 'react';

import ComponentCustomerDetail from '@/components/apps/sales/sales_customer/component-customer-detail';

export const metadata: Metadata = {
  title: 'Customer',
};
const CustomerDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentCustomerDetail pkid={params.pkid} />;
};

export default CustomerDetailPage;

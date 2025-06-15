import { Metadata } from 'next';
import React from 'react';

import ComponentsCustomer from '@/components/apps/sales/sales_customer/component-customer';

export const metadata: Metadata = {
  title: 'Customer',
};

const CustomerPage = () => {
  return <ComponentsCustomer />;
};

export default CustomerPage;

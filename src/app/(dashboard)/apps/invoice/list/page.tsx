import { Metadata } from 'next';
import React from 'react';

import ComponentsAppsInvoiceList from '@/components/apps/mailbox/invoice/components-apps-invoice-list';

export const metadata: Metadata = {
  title: 'Invoice List',
};

const InvoiceList = () => {
  return <ComponentsAppsInvoiceList />;
};

export default InvoiceList;

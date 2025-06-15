import { Metadata } from 'next';
import React from 'react';

import ComponentsAppsInvoiceEdit from '@/components/apps/mailbox/invoice/components-apps-invoice-edit';

export const metadata: Metadata = {
  title: 'Invoice Edit',
};

const InvoiceEdit = () => {
  return <ComponentsAppsInvoiceEdit />;
};

export default InvoiceEdit;

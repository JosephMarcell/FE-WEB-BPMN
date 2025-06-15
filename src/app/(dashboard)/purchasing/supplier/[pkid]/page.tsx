import { Metadata } from 'next';
import React from 'react';

import ComponentSupplierDetail from '@/components/apps/purchasing/purchasing_supplier/component-supplier-detail';

export const metadata: Metadata = {
  title: 'Supplier',
};
const SupplierDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentSupplierDetail pkid={params.pkid} />;
};

export default SupplierDetailPage;

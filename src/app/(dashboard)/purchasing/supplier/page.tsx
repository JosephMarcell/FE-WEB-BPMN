import { Metadata } from 'next';
import React from 'react';

import ComponentsSupplier from '@/components/apps/purchasing/purchasing_supplier/component-supplier';

export const metadata: Metadata = {
  title: 'Supplier',
};

const SupplierPage = () => {
  return <ComponentsSupplier />;
};

export default SupplierPage;

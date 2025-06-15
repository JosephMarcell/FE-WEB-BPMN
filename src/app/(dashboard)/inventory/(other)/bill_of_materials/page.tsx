import { Metadata } from 'next';
import React from 'react';

import ComponentsBillOfMaterial from '@/components/apps/inventory/other/bill_of_materials/component-bill-of-material';

export const metadata: Metadata = {
  title: 'Bill Of Material',
};

const BillOfMaterialPage = () => {
  return <ComponentsBillOfMaterial />;
};

export default BillOfMaterialPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentsBillsOfMaterials from '@/components/apps/inventory/master_data/bill_of_materials/component-bill-of-materials';

export const metadata: Metadata = {
  title: 'Bills of Materials',
};

const BillsOfMaterialsPage = () => {
  return <ComponentsBillsOfMaterials />;
};

export default BillsOfMaterialsPage;

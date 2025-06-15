import { Metadata } from 'next';
import React from 'react';

import ComponentsSpareparts from '@/components/apps/inventory/items/spare_parts/component-spareparts';

export const metadata: Metadata = {
  title: 'Spareparts',
};

const SparepartsPage = () => {
  return <ComponentsSpareparts />;
};

export default SparepartsPage;

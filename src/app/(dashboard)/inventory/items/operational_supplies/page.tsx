import { Metadata } from 'next';
import React from 'react';

import ComponentsOperationalSupplies from '@/components/apps/inventory/items/operational_supplies/component-operational-supplies';

export const metadata: Metadata = {
  title: 'Operational Supplies',
};

const OperationalSuppliesPage = () => {
  return <ComponentsOperationalSupplies />;
};

export default OperationalSuppliesPage;

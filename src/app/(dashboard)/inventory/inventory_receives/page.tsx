import { Metadata } from 'next';
import React from 'react';

import ComponentsInventoryReceives from '@/components/apps/inventory/inventory_receives/component-inventory-receives';

export const metadata: Metadata = {
  title: 'Inventory Receives',
};

const InventoryReceivesPage = () => {
  return <ComponentsInventoryReceives />;
};

export default InventoryReceivesPage;

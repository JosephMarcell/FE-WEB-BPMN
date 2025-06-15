import { Metadata } from 'next';
import React from 'react';

import ComponentsInventoryItems from '@/components/apps/inventory/inventory_items/component-inventory-items';

export const metadata: Metadata = {
  title: 'Inventory Items',
};

const InventoryItemsPage = () => {
  return <ComponentsInventoryItems />;
};

export default InventoryItemsPage;

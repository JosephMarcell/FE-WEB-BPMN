import { Metadata } from 'next';
import React from 'react';

import ComponentsInventoryReceives from '@/components/apps/inventory/inventory_receives/component-inventory-receives';

export const metadata: Metadata = {
  title: 'Receive Items',
};

const InventoryReceiveItemsPage = () => {
  return <ComponentsInventoryReceives />;
};

export default InventoryReceiveItemsPage;

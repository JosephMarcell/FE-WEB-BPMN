import { Metadata } from 'next';
import React from 'react';

import ComponentsInventoryTransfers from '@/components/apps/inventory/inventory_transfers/component-inventory-transfers';

export const metadata: Metadata = {
  title: 'Transfer Item',
};

const InventoryTransferItemsPage = () => {
  return <ComponentsInventoryTransfers />;
};

export default InventoryTransferItemsPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentsInventoryWarehouse from '@/components/apps/inventory/inventory_storages/component-inventory-warehouse';

export const metadata: Metadata = {
  title: 'Inventory Warehouse',
};

const InventoryStoragesPage = () => {
  return <ComponentsInventoryWarehouse />;
};

export default InventoryStoragesPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentsWarehouse from '@/components/apps/inventory/master_data/warehouse/component-warehouse';

export const metadata: Metadata = {
  title: 'Warehouse',
};

const WarehousePage = () => {
  return <ComponentsWarehouse />;
};

export default WarehousePage;

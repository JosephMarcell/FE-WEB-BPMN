import { Metadata } from 'next';
import React from 'react';

import ComponentInventoryReceiveDetail from '@/components/apps/inventory/inventory_receives/component-inventory-receive-detail';

export const metadata: Metadata = {
  title: 'Inventory Receives',
};
const InventoryReceiveDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentInventoryReceiveDetail pkid={params.pkid} />;
};

export default InventoryReceiveDetailPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentInventoryTransferDetail from '@/components/apps/inventory/inventory_transfers/component-inventory-transfer-detail';

export const metadata: Metadata = {
  title: 'Inventory Transfer',
};
const InventoryTransferDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentInventoryTransferDetail pkid={params.pkid} />;
};

export default InventoryTransferDetailPage;

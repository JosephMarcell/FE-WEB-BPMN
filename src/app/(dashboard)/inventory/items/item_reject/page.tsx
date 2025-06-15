import { Metadata } from 'next';
import React from 'react';

import ComponentsItemRejects from '@/components/apps/inventory/items/item_reject/component-item-reject';

export const metadata: Metadata = {
  title: 'Item Reject',
};

const ItemRejectPage = () => {
  return <ComponentsItemRejects />;
};

export default ItemRejectPage;

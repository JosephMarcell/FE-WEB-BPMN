import { Metadata } from 'next';
import React from 'react';

import ComponentsPurchasingOrder from '@/components/apps/purchasing/purchasing_order/component-purchasing-order';

export const metadata: Metadata = {
  title: 'Purchase Order',
};

const PurchasingOrderPage = () => {
  return <ComponentsPurchasingOrder />;
};

export default PurchasingOrderPage;

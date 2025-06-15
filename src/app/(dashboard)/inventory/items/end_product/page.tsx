import { Metadata } from 'next';
import React from 'react';

import ComponentsEndProduct from '@/components/apps/inventory/items/end_product/component-end-product';

export const metadata: Metadata = {
  title: 'End Product',
};

const EndProductPage = () => {
  return <ComponentsEndProduct />;
};

export default EndProductPage;

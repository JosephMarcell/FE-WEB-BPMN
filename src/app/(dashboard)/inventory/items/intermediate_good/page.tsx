import { Metadata } from 'next';
import React from 'react';

import ComponentsIntermediateGoods from '@/components/apps/inventory/items/intermediate_goods/component-intermediate-goods';

export const metadata: Metadata = {
  title: 'Intermediate Goods',
};

const IntermediateGoodsPage = () => {
  return <ComponentsIntermediateGoods />;
};

export default IntermediateGoodsPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentIntermediateGoodDetail from '@/components/apps/inventory/items/intermediate_goods/component-intermediate-goods-detail';

export const metadata: Metadata = {
  title: 'Intermediate Goods Detail',
};
const IntermediateGoodDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentIntermediateGoodDetail pkid={params.pkid} />;
};

export default IntermediateGoodDetailPage;

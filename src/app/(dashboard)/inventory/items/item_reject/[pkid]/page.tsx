import { Metadata } from 'next';
import React from 'react';

import ComponentEndProductDetail from '@/components/apps/inventory/items/end_product/component-end-product-detail';

export const metadata: Metadata = {
  title: 'Item Reject Detail',
};
const ItemRejectDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentEndProductDetail pkid={params.pkid} />;
};

export default ItemRejectDetailPage;

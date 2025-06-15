import { Metadata } from 'next';
import React from 'react';

import ComponentEndProductDetail from '@/components/apps/inventory/items/end_product/component-end-product-detail';

export const metadata: Metadata = {
  title: 'End Product Detail',
};
const EndProductDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentEndProductDetail pkid={params.pkid} />;
};

export default EndProductDetailPage;

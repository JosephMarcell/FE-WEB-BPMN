import { Metadata } from 'next';
import React from 'react';

import ComponentOrderRequestDetail from '@/components/apps/purchasing/purchasing_order/component-purchasing-order-detail';

export const metadata: Metadata = {
  title: 'Purchase Request',
};
const PurchaseOrderDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentOrderRequestDetail pkid={params.pkid} />;
};

export default PurchaseOrderDetailPage;

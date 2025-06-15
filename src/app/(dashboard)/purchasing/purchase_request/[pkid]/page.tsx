import { Metadata } from 'next';
import React from 'react';

import ComponentPurchaseRequestDetail from '@/components/apps/purchasing/purchasing_request/component-purchasing-request-detail';

export const metadata: Metadata = {
  title: 'Purchase Request',
};
const PurchaseRequestDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentPurchaseRequestDetail pkid={params.pkid} />;
};

export default PurchaseRequestDetailPage;

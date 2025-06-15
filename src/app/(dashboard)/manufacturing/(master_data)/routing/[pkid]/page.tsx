import { Metadata } from 'next';
import React from 'react';

import ComponentRoutingDetail from '@/components/apps/manufacturing/master_data/routing/component-routing-detail';

export const metadata: Metadata = {
  title: 'Routing',
};

const RoutingDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentRoutingDetail pkid={params.pkid} />;
};

export default RoutingDetailPage;

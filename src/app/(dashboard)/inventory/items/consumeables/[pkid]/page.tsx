import { Metadata } from 'next';
import React from 'react';

import ComponentConsumeablesDetail from '@/components/apps/inventory/items/consumeables/component-consumeables-detail';

export const metadata: Metadata = {
  title: 'Consumebles Detail',
};
const ConsumeablesDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentConsumeablesDetail pkid={params.pkid} />;
};

export default ConsumeablesDetailPage;

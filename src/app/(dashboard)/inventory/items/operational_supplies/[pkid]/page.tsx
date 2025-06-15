import { Metadata } from 'next';
import React from 'react';

import ComponentOperationalSuppliesDetail from '@/components/apps/inventory/items/operational_supplies/component-operational-supplies-detail';

export const metadata: Metadata = {
  title: 'End Product Detail',
};
const OperationalSuppliesDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentOperationalSuppliesDetail pkid={params.pkid} />;
};

export default OperationalSuppliesDetailPage;

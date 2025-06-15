import { Metadata } from 'next';
import React from 'react';

import ComponentSparepartsDetail from '@/components/apps/inventory/items/spare_parts/component-spareparts-detail';

export const metadata: Metadata = {
  title: 'Spareparts Detail',
};
const SparepartsDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentSparepartsDetail pkid={params.pkid} />;
};

export default SparepartsDetailPage;

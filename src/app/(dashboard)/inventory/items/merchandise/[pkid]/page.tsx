import { Metadata } from 'next';
import React from 'react';

import ComponentMerchandiseDetail from '@/components/apps/inventory/items/merchandise/component-merchandise-detail';

export const metadata: Metadata = {
  title: 'Merchandise Detail',
};
const MerchandiseDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentMerchandiseDetail pkid={params.pkid} />;
};

export default MerchandiseDetailPage;

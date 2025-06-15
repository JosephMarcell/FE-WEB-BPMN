import { Metadata } from 'next';
import React from 'react';

import ComponentRawMaterialDetail from '@/components/apps/inventory/items/raw_material/component-raw-material-detail';

export const metadata: Metadata = {
  title: 'Raw Material Detail',
};
const RawMaterialDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentRawMaterialDetail pkid={params.pkid} />;
};

export default RawMaterialDetailPage;

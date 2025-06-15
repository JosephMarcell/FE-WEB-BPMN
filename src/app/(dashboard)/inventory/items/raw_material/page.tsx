import { Metadata } from 'next';
import React from 'react';

import ComponentsRawMaterial from '@/components/apps/inventory/items/raw_material/component-raw-material';

export const metadata: Metadata = {
  title: 'Raw Material',
};

const RawMaterialPage = () => {
  return <ComponentsRawMaterial />;
};

export default RawMaterialPage;

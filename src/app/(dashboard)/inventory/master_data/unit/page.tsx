import { Metadata } from 'next';
import React from 'react';

import ComponentsUnit from '@/components/apps/inventory/master_data/unit/component-unit';

export const metadata: Metadata = {
  title: 'Unit',
};

const UnitPage = () => {
  return <ComponentsUnit />;
};

export default UnitPage;

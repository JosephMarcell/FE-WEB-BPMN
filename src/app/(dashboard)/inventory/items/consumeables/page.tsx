import { Metadata } from 'next';
import React from 'react';

import ComponentsConsumeables from '@/components/apps/inventory/items/consumeables/component-consumeables';

export const metadata: Metadata = {
  title: 'Consumeables',
};

const ConsumeablesPage = () => {
  return <ComponentsConsumeables />;
};

export default ConsumeablesPage;

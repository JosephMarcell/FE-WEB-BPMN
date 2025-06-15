import { Metadata } from 'next';
import React from 'react';

import ComponentsDelayedProductions from '@/components/apps/inventory/delayed_production/component-delayed-production';

export const metadata: Metadata = {
  title: 'Delayed Productions',
};

const DelayedProductionsPage = () => {
  return <ComponentsDelayedProductions />;
};

export default DelayedProductionsPage;

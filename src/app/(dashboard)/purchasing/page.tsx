import { Metadata } from 'next';
import React from 'react';

import ComponentsPurchasingMenu from '@/components/apps/purchasing/purchasing_menu/component-purchasing-menu';

export const metadata: Metadata = {
  title: 'Purchasing Menu',
};

const PurchasingMenuPage = () => {
  return <ComponentsPurchasingMenu />;
};

export default PurchasingMenuPage;

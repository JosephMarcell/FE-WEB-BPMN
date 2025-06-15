import { Metadata } from 'next';
import React from 'react';

import ComponentsMerchandise from '@/components/apps/inventory/items/merchandise/component-merchandise';

export const metadata: Metadata = {
  title: 'Trade Goods',
};

const MerchandisePage = () => {
  return <ComponentsMerchandise />;
};

export default MerchandisePage;

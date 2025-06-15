import { Metadata } from 'next';
import React from 'react';

import ComponentsAssetStockTake from '@/components/apps/asset/asset_stock_take/component-stock-take';

export const metadata: Metadata = {
  title: 'Asset Stock Take',
};

const AssetStockTakePage = () => {
  return <ComponentsAssetStockTake />;
};

export default AssetStockTakePage;

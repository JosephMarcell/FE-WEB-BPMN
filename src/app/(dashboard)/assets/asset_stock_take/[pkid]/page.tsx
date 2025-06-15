import { Metadata } from 'next';
import React from 'react';

import ComponentAssetStockTakeDetail from '@/components/apps/asset/asset_stock_take/component-stock-take-detail';

export const metadata: Metadata = {
  title: 'Asset Stock Take',
};
const AssetStockTakeDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentAssetStockTakeDetail pkid={params.pkid} />;
};

export default AssetStockTakeDetailPage;

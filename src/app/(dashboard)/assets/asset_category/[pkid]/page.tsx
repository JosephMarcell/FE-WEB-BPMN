import { Metadata } from 'next';
import React from 'react';

import ComponentAssetCategoryDetail from '@/components/apps/asset/asset_category/component-asset-category-detail';

export const metadata: Metadata = {
  title: 'Asset Category',
};
const AssetCategoryDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentAssetCategoryDetail pkid={params.pkid} />;
};

export default AssetCategoryDetailPage;

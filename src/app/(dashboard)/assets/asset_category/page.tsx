import { Metadata } from 'next';
import React from 'react';

import ComponentsAssetCategory from '@/components/apps/asset/asset_category/component-asset-category';

export const metadata: Metadata = {
  title: 'Asset Category',
};

const AssetCategoryPage = () => {
  return <ComponentsAssetCategory />;
};

export default AssetCategoryPage;

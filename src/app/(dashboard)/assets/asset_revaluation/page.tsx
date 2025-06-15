import { Metadata } from 'next';
import React from 'react';

import ComponentsAssetRevaluation from '@/components/apps/asset/asset_revaluation/component-asset-revaluation';

export const metadata: Metadata = {
  title: 'Asset Revaluation',
};

const AssetRevaluationPage = () => {
  return <ComponentsAssetRevaluation />;
};

export default AssetRevaluationPage;

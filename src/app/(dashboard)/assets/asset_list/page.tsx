import { Metadata } from 'next';
import React from 'react';

import ComponentAsset from '@/components/apps/asset/asset_list/component-asset';

export const metadata: Metadata = {
  title: 'Asset List',
};

const AssetPage = () => {
  return <ComponentAsset />;
};

export default AssetPage;

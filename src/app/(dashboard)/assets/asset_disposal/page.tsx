import { Metadata } from 'next';
import React from 'react';

import ComponentsAssetDisposal from '@/components/apps/asset/asset_disposal/component-asset-disposal';

export const metadata: Metadata = {
  title: 'Asset Disposal',
};

const AssetDisposalPage = () => {
  return <ComponentsAssetDisposal />;
};

export default AssetDisposalPage;

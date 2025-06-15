import { Metadata } from 'next';
import React from 'react';

import ComponentAssetDisposalDetail from '@/components/apps/asset/asset_disposal/component-asset-disposal-detail';

export const metadata: Metadata = {
  title: 'Asset Disposal',
};
const AssetDisposalDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentAssetDisposalDetail pkid={params.pkid} />;
};

export default AssetDisposalDetailPage;

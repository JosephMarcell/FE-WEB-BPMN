import { Metadata } from 'next';
import React from 'react';

import ComponentAssetTransferDetail from '@/components/apps/asset/asset_transfer/component-asset-transfer-detail';

export const metadata: Metadata = {
  title: 'Asset Transfer',
};
const AssetTransferDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentAssetTransferDetail pkid={params.pkid} />;
};

export default AssetTransferDetailPage;

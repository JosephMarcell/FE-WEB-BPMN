import { Metadata } from 'next';
import React from 'react';

import ComponentsAssetTransfer from '@/components/apps/asset/asset_transfer/component-asset-transfer';

export const metadata: Metadata = {
  title: 'Asset Transfer',
};

const AssetTransferPage = () => {
  return <ComponentsAssetTransfer />;
};

export default AssetTransferPage;

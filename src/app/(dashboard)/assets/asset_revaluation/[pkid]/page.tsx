import { Metadata } from 'next';
import React from 'react';

import ComponentAssetRevaluationDetail from '@/components/apps/asset/asset_revaluation/component-asset-revaluation-detail';

export const metadata: Metadata = {
  title: 'Asset Revaluation',
};
const AssetRevaluationDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentAssetRevaluationDetail pkid={params.pkid} />;
};

export default AssetRevaluationDetailPage;

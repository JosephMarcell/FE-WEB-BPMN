import { Metadata } from 'next';
import React from 'react';

import ComponentAssetMaintenanceDetail from '@/components/apps/asset/maintenance_log/component-asset-maintenance-log-detail';

export const metadata: Metadata = {
  title: 'Asset Maintenance',
};
const AssetMaintenanceDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentAssetMaintenanceDetail pkid={params.pkid} />;
};

export default AssetMaintenanceDetailPage;

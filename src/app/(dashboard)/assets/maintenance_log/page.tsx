import { Metadata } from 'next';
import React from 'react';

import ComponentsAssetMaintenance from '@/components/apps/asset/maintenance_log/component-asset-maintenance-log';

export const metadata: Metadata = {
  title: 'Asset Maintenance',
};

const AssetMaintenancePage = () => {
  return <ComponentsAssetMaintenance />;
};

export default AssetMaintenancePage;

import { Metadata } from 'next';
import React from 'react';

import ComponentsEachAssetMaintenanceLog from '@/components/apps/asset/maintenance_log/component-each-maintenance-log';

export const metadata: Metadata = {
  title: 'Asset Maintenance',
};
const AssetEachMaintenanceLogPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentsEachAssetMaintenanceLog pkid={params.pkid} />;
};

export default AssetEachMaintenanceLogPage;

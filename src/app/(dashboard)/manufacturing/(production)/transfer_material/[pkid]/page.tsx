import { Metadata } from 'next';
import React from 'react';

import ComponentTransferMaterialDetail from '@/components/apps/manufacturing/production/transfer_material/component-transfer-material-detail';

export const metadata: Metadata = {
  title: 'Transfer Material Detail',
};

const TransferMaterialDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentTransferMaterialDetail pkid={params.pkid} />;
};

export default TransferMaterialDetailPage;

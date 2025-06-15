import { Metadata } from 'next';
import React from 'react';

import BillOfMaterialDetail from '@/components/apps/inventory/other/bill_of_materials/component-bill-of-material-detail';

export const metadata: Metadata = {
  title: 'Bill Of Material',
};
const BillOfMaterialDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <BillOfMaterialDetail pkid={params.pkid} />;
};

export default BillOfMaterialDetailPage;

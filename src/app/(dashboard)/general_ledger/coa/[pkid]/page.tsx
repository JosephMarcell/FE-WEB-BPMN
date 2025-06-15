import { Metadata } from 'next';
import React from 'react';

import ComponentCOADetail from '@/components/apps/general_ledger/coa/component-coa-detail';

export const metadata: Metadata = {
  title: 'Asset Category',
};
const COADetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentCOADetail pkid={params.pkid} />;
};

export default COADetailPage;

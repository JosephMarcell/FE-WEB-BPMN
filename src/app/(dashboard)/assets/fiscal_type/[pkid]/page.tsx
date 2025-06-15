import { Metadata } from 'next';
import React from 'react';

import ComponentFiscalTypeDetail from '@/components/apps/asset/fiscal_type/component-fiscal-type-detail';

export const metadata: Metadata = {
  title: 'Asset Disposal',
};
const AssetFiscalTypeDetailPage = ({
  params,
}: {
  params: { pkid: number };
}) => {
  return <ComponentFiscalTypeDetail pkid={params.pkid} />;
};

export default AssetFiscalTypeDetailPage;

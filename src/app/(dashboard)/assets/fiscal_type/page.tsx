import { Metadata } from 'next';
import React from 'react';

import ComponentsFiscalType from '@/components/apps/asset/fiscal_type/component-fiscal-type';

export const metadata: Metadata = {
  title: 'Fiscal Type',
};

const FiscalTypeDetailPage = () => {
  return <ComponentsFiscalType />;
};

export default FiscalTypeDetailPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentAsset from '@/components/apps/violations/violation-list';

export const metadata: Metadata = {
  title: 'Violations',
};

const ViolationPage = () => {
  return <ComponentAsset />;
};

export default ViolationPage;

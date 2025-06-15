import { Metadata } from 'next';
import React from 'react';

import ComponentPosition from '@/components/apps/hrm/information_management/position/component-position';

export const metadata: Metadata = {
  title: 'Position',
};

const PositionPage = () => {
  return <ComponentPosition />;
};

export default PositionPage;

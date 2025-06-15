import { Metadata } from 'next';
import React from 'react';

import ComponentPositionDetail from '@/components/apps/hrm/information_management/position/component-position-detail';

export const metadata: Metadata = {
  title: 'Position',
};
const PositionDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentPositionDetail pkid={params.pkid} />;
};

export default PositionDetailPage;

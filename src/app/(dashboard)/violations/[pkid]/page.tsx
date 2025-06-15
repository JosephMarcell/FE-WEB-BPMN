import { Metadata } from 'next';
import React from 'react';

import ViolationDetail from '@/components/apps/violations/violation-detail';

export const metadata: Metadata = {
  title: 'Violations Detail',
};
const ViolationDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ViolationDetail pkid={params.pkid} />;
};

export default ViolationDetailPage;

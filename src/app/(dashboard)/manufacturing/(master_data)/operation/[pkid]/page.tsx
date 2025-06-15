import { Metadata } from 'next';
import React from 'react';

import ComponentOperationDetail from '@/components/apps/manufacturing/master_data/operation/component-operation-detail';

export const metadata: Metadata = {
  title: 'Operation',
};

const OperationDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentOperationDetail pkid={params.pkid} />;
};

export default OperationDetailPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentJobOrderDetail from '@/components/apps/manufacturing/production/job_order/component-job-order-detail';

export const metadata: Metadata = {
  title: 'Job Order Detail',
};

const JobOrderDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentJobOrderDetail pkid={params.pkid} />;
};

export default JobOrderDetailPage;

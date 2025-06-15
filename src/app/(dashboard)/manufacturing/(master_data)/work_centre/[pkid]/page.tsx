import { Metadata } from 'next';
import React from 'react';

import ComponentWorkCentreDetail from '@/components/apps/manufacturing/master_data/work_centre/component-work-centre-detail';

export const metadata: Metadata = {
  title: 'Work Centre',
};

const WorkCentreDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentWorkCentreDetail pkid={params.pkid} />;
};

export default WorkCentreDetailPage;

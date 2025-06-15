import { Metadata } from 'next';
import React from 'react';

import ComponentIssueMaterialDetail from '@/components/apps/manufacturing/production/issue_material/component-issue-material-detail';

export const metadata: Metadata = {
  title: 'Issue Material Detail',
};

const IssueMaterialDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentIssueMaterialDetail pkid={params.pkid} />;
};

export default IssueMaterialDetailPage;

import { Metadata } from 'next';
import React from 'react';

import ComponentResourceDetail from '@/components/apps/asset/resource/component-resource-detail';

export const metadata: Metadata = {
  title: 'Asset Maintenance',
};
const ResourceDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentResourceDetail pkid={params.pkid} />;
};

export default ResourceDetailPage;

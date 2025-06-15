import { Metadata } from 'next';
import React from 'react';

import ComponentFacilityDetail from '@/components/apps/asset/facility/component-facility-detail';

export const metadata: Metadata = {
  title: 'Sarana dan Prasarana',
};
const FacilityDetailPage = ({ params }: { params: { pkid: number } }) => {
  return <ComponentFacilityDetail pkid={params.pkid} />;
};

export default FacilityDetailPage;

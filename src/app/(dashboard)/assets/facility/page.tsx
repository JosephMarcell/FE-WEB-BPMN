import { Metadata } from 'next';
import React from 'react';

import ComponentsFacility from '@/components/apps/asset/facility/component-facility';

export const metadata: Metadata = {
  title: 'Facility',
};

const FacilityPage = () => {
  return <ComponentsFacility />;
};

export default FacilityPage;

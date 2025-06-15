import { Metadata } from 'next';
import React from 'react';

import ComponentsDashboardLiveTracking from '@/components/dashboard/components-dashboard-live-tracking';

export const metadata: Metadata = {
  title: 'Live Tracking Admin',
};

const LiveTracking = () => {
  return <ComponentsDashboardLiveTracking />;
};

export default LiveTracking;

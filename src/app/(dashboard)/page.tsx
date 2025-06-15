import { Metadata } from 'next';
import React from 'react';

import ComponentsDashboardGeneral from '@/components/dashboard/components-dashboard-general';

export const metadata: Metadata = {
  title: 'DroneMEQ',
  description:
    'System information that utilize drone to help Konservasi Laut in managing the sea water sample',
  keywords: ['drones', 'drone tracking', 'AI monitoring', 'Next.js', 'Golang'],
  robots: 'index, follow',
};

const General = () => {
  return <ComponentsDashboardGeneral />;
};

export default General;

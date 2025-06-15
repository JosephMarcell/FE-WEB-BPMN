import { Metadata } from 'next';
import React from 'react';

import ComponentWaterQuality from '@/components/apps/environment_quality/water_quality/component-water-quality';

export const metadata: Metadata = {
  title: 'Environment Quality',
};

const EnvironmentQualityPage = () => {
  return <ComponentWaterQuality />;
};

export default EnvironmentQualityPage;

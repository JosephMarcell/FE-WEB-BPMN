import { Metadata } from 'next';
import React from 'react';

import ComponentWaterQuality from '@/components/apps/environment_quality/water_quality/component-water-quality';

export const metadata: Metadata = {
  title: 'Water Quality',
};

const WaterQualityPage = () => {
  return <ComponentWaterQuality />;
};

export default WaterQualityPage;

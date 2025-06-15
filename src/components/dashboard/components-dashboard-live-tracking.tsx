import dynamic from 'next/dynamic';
import React from 'react';

export const revalidate = 60;

const GisContainer = dynamic(() => import('src/components/map/GisContainer'), {
  loading: () => (
    <div className=''>
      <>Tunggu sebentar</>
    </div>
  ),
  ssr: false,
});

const ComponentsDashboardLiveTracking = () => {
  return <GisContainer />;
};

export default ComponentsDashboardLiveTracking;

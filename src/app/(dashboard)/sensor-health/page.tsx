'use client';

import React, { useEffect, useState } from 'react';

import SensorHealthMain from '@/components/sensor-health/sensor-health-main';

const SensorHealthPage = () => {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div>
      <ul className='flex space-x-2 rtl:space-x-reverse'>
        <li>
          <span className='text-primary font-bold'>Monitoring</span>
        </li>
        <li className="before:content-['/'] ltr:before:mr-2 rtl:before:ml-2"></li>
        <li>
          <span className='font-semibold text-blue-700'>Sensor Health</span>
        </li>
      </ul>

      {isMounted && <SensorHealthMain />}
    </div>
  );
};

export default SensorHealthPage;

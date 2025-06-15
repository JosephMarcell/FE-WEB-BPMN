'use client';

import React, { useEffect, useState } from 'react';

import SensorConfigurationMain from '@/components/sensor-configuration/sensor-configuration-main';

const SensorConfigurationPage = () => {
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
          <span className='font-semibold text-blue-700'>
            Sensor Configuration
          </span>
        </li>
      </ul>

      {isMounted && <SensorConfigurationMain />}
    </div>
  );
};

export default SensorConfigurationPage;

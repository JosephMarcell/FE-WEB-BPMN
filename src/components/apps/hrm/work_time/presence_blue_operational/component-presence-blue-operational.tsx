'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PresenceBlueInfo from '@/components/apps/hrm/work_time/presence_blue_operational/_components/presence-blue-info';

const ComponentsPresenceBlue = () => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <PresenceBlueInfo />
    </div>
  );
};

export default ComponentsPresenceBlue;

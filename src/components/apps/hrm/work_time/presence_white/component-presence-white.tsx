'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PresenceWhiteInfo from '@/components/apps/hrm/work_time/presence_white/_components/presence-white-info';

const ComponentsPresenceWhite = () => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <PresenceWhiteInfo />
    </div>
  );
};

export default ComponentsPresenceWhite;

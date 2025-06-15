'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import HolidaySchedule from '@/components/apps/hrm/work_time/holiday_schedule/_components/holiday-schedule';

const ComponentsHolidaySchedule = () => {
  const pathname = usePathname();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='flex'>
        <div>
          <HolidaySchedule />
        </div>
      </div>
    </div>
  );
};

export default ComponentsHolidaySchedule;

'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import Calendar from '@/components/apps/scheduling/manufacture_schedule/_components/calendar';

const ComponentManufactureSchedule = () => {
  const pathname = usePathname();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <Calendar />
      </div>
    </div>
  );
};

export default ComponentManufactureSchedule;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import HRMMenu from '@/components/apps/hrm/hrm_menu/_components/menu';

interface HRMMenuProps {
  sub_menu: string;
}

const ComponentsHRMMenu = ({ sub_menu }: HRMMenuProps) => {
  const pathname = usePathname();

  return (
    <div className='mb-5 space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <HRMMenu sub_menu={sub_menu} />
      </div>
    </div>
  );
};

export default ComponentsHRMMenu;

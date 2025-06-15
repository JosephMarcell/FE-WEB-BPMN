'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import PurchasingMenu from '@/components/apps/purchasing/purchasing_menu/_components/menu';

const ComponentsPurchasingMenu = () => {
  const pathname = usePathname();

  return (
    <div className='mb-5 space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <PurchasingMenu />
      </div>
    </div>
  );
};

export default ComponentsPurchasingMenu;

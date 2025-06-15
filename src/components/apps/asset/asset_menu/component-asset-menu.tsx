'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import AssetMenu from '@/components/apps/asset/asset_menu/_components/menu';

const ComponentsAssetMenu = () => {
  const pathname = usePathname();

  return (
    <div className='mb-5 space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 sm:h-[calc(100vh_-_150px)]'>
        <AssetMenu />
      </div>
    </div>
  );
};

export default ComponentsAssetMenu;

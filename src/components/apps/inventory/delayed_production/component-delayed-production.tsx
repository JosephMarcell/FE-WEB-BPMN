'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import DelayedProductionTable from '@/components/apps/inventory/delayed_production/_components/transfers-table';

import { useGetAllDelayedProduction } from '@/app/api/hooks/inventory/delayed_production/useGetAllDelayedProduction';

const ComponentsDelayedProductions = () => {
  const pathname = usePathname();
  const {
    data: listDelayedProduction,
    isLoading,
    refetch,
  } = useGetAllDelayedProduction();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col sm:h-[calc(100vh_-_150px)]'>
        <DelayedProductionTable
          data={listDelayedProduction}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsDelayedProductions;

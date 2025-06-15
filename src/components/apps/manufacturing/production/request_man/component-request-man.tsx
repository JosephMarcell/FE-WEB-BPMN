'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import RequestManTable from '@/components/apps/manufacturing/production/request_man/_components/request-man-table';

import { useGetAllRequestMan } from '@/app/api/hooks/manufacturing/request_man/useGetAllRequestMan';

const ComponentsRequestMan = () => {
  const pathname = usePathname();

  const { data: listRequestMan, isLoading, refetch } = useGetAllRequestMan();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        <RequestManTable
          data={listRequestMan}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsRequestMan;

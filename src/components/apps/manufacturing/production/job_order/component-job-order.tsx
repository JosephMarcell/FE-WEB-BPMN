'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import JobOrderTable from '@/components/apps/manufacturing/production/job_order/_components/job-order-table';

import { useGetAllJobOrder } from '@/app/api/hooks/manufacturing/job_order/useGetAllJobOrder';

const ComponentsJobOrder = () => {
  const pathname = usePathname();

  const { data: listJobOrder, isLoading, refetch } = useGetAllJobOrder();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />

      <div className='relative flex h-full flex-col gap-5'>
        <JobOrderTable
          data={listJobOrder}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsJobOrder;

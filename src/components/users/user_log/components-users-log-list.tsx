'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import UserActivityTable from '@/components/users/user_log/_components/user-activity-table';

import { useGetAllActivityLog } from '@/app/api/hooks/user_management/user_log/useGetAllActivityLog';

const ComponentsUsersActivityList = () => {
  const pathname = usePathname();

  const { data: listActivity, isLoading, refetch } = useGetAllActivityLog();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5 '>
        <UserActivityTable
          data={listActivity}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsUsersActivityList;

'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import IssueMaterialTable from '@/components/apps/manufacturing/production/issue_material/_components/issue-material-table';

import { useGetUniqueIssueMaterialByProductionOrderPkid } from '@/app/api/hooks/manufacturing/issue_material/useGetUniqueIssueMaterialByProductionOrderPkid';

const ComponentsIssueMaterial = () => {
  const pathname = usePathname();

  const {
    data: listUniqueIssueMaterial,
    isLoading,
    refetch,
  } = useGetUniqueIssueMaterialByProductionOrderPkid();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />

      <div className='relative flex h-full flex-col gap-5'>
        <IssueMaterialTable
          data={listUniqueIssueMaterial}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsIssueMaterial;

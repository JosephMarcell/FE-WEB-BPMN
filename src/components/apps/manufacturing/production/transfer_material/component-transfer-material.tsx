'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import TransferMaterialTable from '@/components/apps/manufacturing/production/transfer_material/_components/transfer-material-table';

import { useGetUniqueTransferMaterialByProductionOrderPkid } from '@/app/api/hooks/manufacturing/transfer_material/useGetUniqueTransferMaterialByProductionOrderPkid';

const ComponentsTransferMaterial = () => {
  const pathname = usePathname();

  const {
    data: listUniqueTransferMaterial,
    isLoading,
    refetch,
  } = useGetUniqueTransferMaterialByProductionOrderPkid();
  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />

      <div className='relative flex h-full flex-col gap-5'>
        <TransferMaterialTable
          data={listUniqueTransferMaterial}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsTransferMaterial;

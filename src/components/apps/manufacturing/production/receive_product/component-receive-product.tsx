'use client';

import { usePathname } from 'next/navigation';
import React from 'react';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ReceiveProductTable from '@/components/apps/manufacturing/production/receive_product/_components/receive-product-table';

import { useGetAllReceiveProduct } from '@/app/api/hooks/manufacturing/receive_product/useGetAllReceiveProduct';

const ComponentsReceiveProduct = () => {
  const pathname = usePathname();

  const {
    data: listReceiveProduct,
    isLoading,
    refetch,
  } = useGetAllReceiveProduct();

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex h-full flex-col gap-5'>
        <ReceiveProductTable
          data={listReceiveProduct}
          isLoading={isLoading}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default ComponentsReceiveProduct;

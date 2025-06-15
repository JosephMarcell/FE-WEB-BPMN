'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import MerchandiseDetailComponent from '@/components/apps/inventory/items/merchandise/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IMerchandiseDetail {
  pkid: number;
}

const ComponentMerchandiseDetail = ({ pkid }: IMerchandiseDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: merchandiseDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <MerchandiseDetailComponent data={merchandiseDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentMerchandiseDetail;

'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import SparepartsDetailComponent from '@/components/apps/inventory/items/spare_parts/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface ISparepartsDetail {
  pkid: number;
}

const ComponentSparepartsDetail = ({ pkid }: ISparepartsDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: SparepartsDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <SparepartsDetailComponent data={SparepartsDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentSparepartsDetail;

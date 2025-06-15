'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ItemRejectDetailComponent from '@/components/apps/inventory/items/item_reject/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IItemRejectDetail {
  pkid: number;
}

const ComponentItemRejectDetail = ({ pkid }: IItemRejectDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: endProductDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <ItemRejectDetailComponent data={endProductDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentItemRejectDetail;

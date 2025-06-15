'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import EndProductDetailComponent from '@/components/apps/inventory/items/end_product/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IEndProductDetail {
  pkid: number;
}

const ComponentEndProductDetail = ({ pkid }: IEndProductDetail) => {
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
          <EndProductDetailComponent data={endProductDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentEndProductDetail;

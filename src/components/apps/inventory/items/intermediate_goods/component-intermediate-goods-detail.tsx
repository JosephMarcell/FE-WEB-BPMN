'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import IntermediateGoodsDetailComponent from '@/components/apps/inventory/items/intermediate_goods/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IIntermediateGoodsDetail {
  pkid: number;
}

const ComponentIntermediateGoodsDetail = ({
  pkid,
}: IIntermediateGoodsDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: intermediateGoodsDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <IntermediateGoodsDetailComponent data={intermediateGoodsDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentIntermediateGoodsDetail;

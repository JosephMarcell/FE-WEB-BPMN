'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import ConsumeablesDetailComponent from '@/components/apps/inventory/items/consumeables/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IConsumeablesDetail {
  pkid: number;
}

const ComponentConsumeablesDetail = ({ pkid }: IConsumeablesDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: consumeablesDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <ConsumeablesDetailComponent data={consumeablesDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentConsumeablesDetail;

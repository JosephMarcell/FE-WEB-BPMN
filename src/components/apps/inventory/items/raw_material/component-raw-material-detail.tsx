'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import RawMaterialDetailComponent from '@/components/apps/inventory/items/raw_material/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IRawMaterialDetail {
  pkid: number;
}

const ComponentRawMaterialDetail = ({ pkid }: IRawMaterialDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: rawMaterialDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <RawMaterialDetailComponent data={rawMaterialDetail} />
        )}
      </div>
    </div>
  );
};

export default ComponentRawMaterialDetail;

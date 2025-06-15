'use client';

import { usePathname } from 'next/navigation';

import CreateBreadCrumb from '@/hooks/createBreadCrumb';

import OperationalSuppliesDetailComponent from '@/components/apps/inventory/items/operational_supplies/_components/detail-page';

import { useGetItemByPkid } from '@/app/api/hooks/inventory/items/item/useGetItemByPkid';

interface IOperationalSuppliesDetail {
  pkid: number;
}

const ComponentOperationalSuppliesDetail = ({
  pkid,
}: IOperationalSuppliesDetail) => {
  const pathname = usePathname();

  // Reuse the data when availalble
  const { data: operationalSuppliesDetail, isLoading } = useGetItemByPkid(pkid);

  return (
    <div className='space-y-5'>
      <CreateBreadCrumb pathname={pathname} key={1} />
      <div className='relative flex flex-col gap-5'>
        {isLoading ? (
          'Loading...'
        ) : (
          <OperationalSuppliesDetailComponent
            data={operationalSuppliesDetail}
          />
        )}
      </div>
    </div>
  );
};

export default ComponentOperationalSuppliesDetail;
